import datetime
import decimal
import json
import re
import threading
from functools import lru_cache

import pymysql
import redis
from django.db.models import Max, Q
from pymysql import OperationalError
from pymysql.constants.CLIENT import MULTI_STATEMENTS
from pymysql.cursors import DictCursor

from sshtunnel import SSHTunnelForwarder

from comMethod.constant import MYSQL, FAILED, SUCCESS, HEADER_PARAM, VAR_PARAM, HOST_PARAM, STRING
from comMethod.diyException import DiyBaseException
from conf.models import ConfParamType
from project.models import ProjectEnvirData
from user.models import UserCfg, UserTempParams


def get_module_related(model, mod_id, related):
    """
    根据mod_id获取它父级id关系
    """
    mod = model.objects.filter(id=mod_id).values('parent_id').first()
    related.insert(0, mod_id)
    if mod['parent_id']:
        get_module_related(model, mod['parent_id'], related)
    return related


def create_next_id(cur_id):
    """
    根据当前的uid生成next_uid
    :param cur_id:
    :return:
    """
    pattern = re.compile('[A-Z]+')
    prefix = pattern.findall(cur_id)[0]
    pattern = re.compile('[0-9]+')
    number = pattern.findall(cur_id)[0]
    return prefix + str(int(number) + 1).rjust(8, '0')


def get_next_id(model, prefix):
    '''
    获取表的新数据id
    生成下一个model中的下一个id,
    id的样式如：INSU0000001
    '''
    result = model.objects.aggregate(Max('id'))
    cur_id = result.get('id__max')
    if cur_id:
        return create_next_id(cur_id)
    else:
        return prefix + '00000001'


def db_connect(data):
    """
    数据库连接
    """
    try:
        ssh_host, ssh_user, ssh_pwd = data.get('ssh_host'), data.get('ssh_user'), data.get('ssh_pwd')
        db_port, db_host = int(data['db_port']), data['db_host']
        db_con, ssh_server = None, None  # 初始化跳板机为空
        if ssh_host and ssh_user and ssh_pwd:
            ssh_server = SSHTunnelForwarder(
                ssh_address_or_host=(ssh_host, 22), ssh_username=ssh_user, ssh_password=ssh_pwd,
                remote_bind_address=(db_host, db_port))
            ssh_server.start()
            db_port, db_host = ssh_server.local_bind_port, '127.0.0.1'
        if (db_type := data['db_type']) == MYSQL:
            connect_data = {'host': db_host, 'user': data['db_user'], 'passwd': data['db_pwd'], 'port': db_port,
                            'cursorclass': DictCursor, 'charset': 'utf8', 'client_flag': MULTI_STATEMENTS}
            if 'db_database' in data:
                connect_data['database'] = data['db_database']
            db_con = pymysql.connect(**connect_data).cursor()
            db_con.connection.autocommit(True)  # 防止缓存
    except (OperationalError, redis.ConnectionError) as e:
        return {'status': FAILED, 'results': f"连接失败：{e}"}
    except Exception as e:
        print('error', str(e))
        if 'SSH gateway' in str(e):
            return {'status': FAILED, 'results': "无法连接ssh！"}
        return {'status': FAILED, 'results': "请完善必填项！"}
    return {'status': SUCCESS, 'db_con': db_con, 'ssh_server': ssh_server}


def get_proj_envir_db_data(sql_proj_related, user_id=None, envir=None):
    """
    获取项目环境下的数据库参数
    """
    envir = envir or UserCfg.objects.filter(user_id=user_id).values_list('envir_id', flat=True).first() or 1
    project_id, db_name = sql_proj_related
    envir_data = ProjectEnvirData.objects.filter(
        project_id=project_id, envir_id=envir).values_list('data', flat=True).first() or {}
    db_data = envir_data.get('db', {}).get(db_name)
    return db_data


def get_show_sql_data(sql_data):
    """
    将sql查询数据转换为展示数据
    """
    columns = [{'title': col, 'dataIndex': col, 'key': col} for col in sql_data[0].keys()] if sql_data else []
    return columns, sql_data


def execute_sql_func(db_con, sql, db_type=MYSQL):
    """
    执行sql的具体方法
    """
    if db_type == MYSQL:
        try:
            db_con.execute(sql)
            columns, sql_data = get_show_sql_data(db_con.fetchall())
            return {'status': SUCCESS, 'data': {'columns': columns, 'sql_data': sql_data, 'sql': sql}}
        except Exception as e:
            return {'status': FAILED, 'results': f'执行出错：{e}', 'sql': sql}
    return {'status': FAILED}


def close_db_con(db_data):
    """
    关闭数据库连接
    """
    db_data['db_con'].close()
    db_data['ssh_server'] and db_data['ssh_server'].close()


class JSONEncoder(json.JSONEncoder):
    """
    处理decimal、datetime
    """

    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        elif isinstance(o, datetime.datetime):
            return str(o)
        super(JSONEncoder, self).default(o)


def json_dumps(data, cls=None):
    """
    避免中文dumps后数据乱码
    """
    if cls:
        return json.dumps(data, cls=cls, ensure_ascii=False)
    return json.dumps(data, ensure_ascii=False)


def json_loads(data):
    """
    避免中文dumps后数据乱码
    """
    try:
        return json.loads(data)
    except Exception:
        return data


def format_parm_type_v(value, parm_type=STRING):
    """
    参数值类型转换
    """
    return str(value) if parm_type == STRING else json_loads(value)


class MyThread(threading.Thread):

    def run(self):
        """Method representing the thread's activity.

        You may override this method in a subclass. The standard run() method
        invokes the callable object passed to the object's constructor as the
        target argument, if any, with sequential and keyword arguments taken
        from the args and kwargs arguments, respectively.

        """
        try:
            if self._target:
                self._target(*self._args, **self._kwargs)
        finally:
            # Avoid a refcycle if the thread is running a function with
            # an argument that has a member that points to the thread.
            del self._target, self._args, self._kwargs


class SavePrintContent:
    """
    保存print打印的内容
    """

    def __init__(self):
        self.buffer = []

    def write(self, *args, **kwargs):
        self.buffer.append(args)


def get_module_children(module_ids: list, module: djangoModel) -> list:
    """
    返回模块及其下所有子模块id
    """
    children_module_ids = list(
        module.objects.filter(parent_id__in=module_ids).values_list('id', flat=True))
    if children_module_ids:
        module_ids.extend(get_module_children(children_module_ids, module))
    return module_ids


def get_case_sort_list(case_model, mod_model, request):
    """
    获取功能用例排序后的列表数据
    """
    module_ids = get_module_children([request.query_params['module_id']], mod_model)
    return case_model.objects.filter(
        module_id__in=module_ids).values('id', 'name', 'level', 'position').order_by('position', 'created')

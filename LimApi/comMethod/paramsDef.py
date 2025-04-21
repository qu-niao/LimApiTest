import re
import sys
from functools import lru_cache

from django.db.models import Q

from comMethod.comDef import SavePrintContent
from comMethod.constant import HEADER_PARAM, VAR_PARAM, HOST_PARAM
from comMethod.diyException import DiyBaseException
from conf.models import ConfParamType
from user.models import UserTempParams


@lru_cache
def get_params_type_func():
    """
    获取参数类型
    """
    return ConfParamType.objects.values('id', 'name')


def get_parm_v_by_temp(name_list, base_params, i=0):
    """
    走模版json(或响应结果)里面去取值（期望判断、输出参数、读取参数）
    a[0]
    """

    if name_list:  # 单条变量或值记录
        _name = name_list[0]
        if isinstance(_name, str):
            if _name.startswith('*') and isinstance(base_params, list):
                _name = _name[1:]
                res_data = []
                for v in base_params:
                    if not isinstance(v, dict):
                        return False
                    if _name not in v:
                        return False
                    get_value = v[_name]
                    if isinstance(get_value, dict) and len(name_list) > 1:
                        get_value = get_parm_v_by_temp(name_list[1:], get_value)['value']
                    res_data.append(get_value)
                base_params = res_data
            else:
                # 数组取索引值
                _index = re.findall(r'\[(.*?)]', _name)  # 可能有多维数组的情况[0][1]
                str_index = ''
                if _index:  # 处理列表索引的情况
                    _name = _name.split('[')[0]
                    if _name:  # 返回结果可能为纯数组，这个时候是没有变量的
                        str_index += '[_name]'
                    for index_name in _index:
                        # []中字符串为纯数字，或者为i，或者为-1这种数字
                        if index_name.isdigit() or index_name == 'i' or (
                                index_name.startswith('-') and index_name[1:].isdigit()):
                            str_index += f'[{index_name}]'
                        else:  # 代表索引名称为一个变量
                            raise DiyBaseException('错误的数组格式，若要使用变量表示数组下标，格式为:[${变量}]')

                if isinstance(base_params, dict):
                    if _name in base_params:
                        # 有exp_index代表是列表，就不能按取字典的方式进下级，应该按索引的方式进入下一级
                        new_response_data = eval(
                            'base_params' + str_index) if _index else base_params[_name]
                        return get_parm_v_by_temp(name_list[1:], new_response_data, i)
                elif isinstance(base_params, list) and _index:  # _name为空的时候会走这个分支，也代表响应结果是纯数组
                    new_response_data = eval('base_params' + str_index)
                    return get_parm_v_by_temp(name_list[1:], new_response_data, i)
                return False
        elif isinstance(_name, list):  # [0].id这种参数时，格式化后会变为[0]的数组，会走这个分支
            new_response_data = eval('base_params' + str(_name))
            return get_parm_v_by_temp(name_list[1:], new_response_data, i)

    return {'value': base_params}


def parse_param_value(v, params, i=0):
    """
    解析参数并获取它对应的值（放在公共方法的原因是为了后面扩展非接口测试的用例类型）
    """
    is_eval = False
    if isinstance(v, str):
        if v.startswith('eval('):
            v, is_eval = v[5:-1], True
        var_name_list = re.findall(r'\${(.*?)}', v)  # 取变量
        if var_name_list:  # 有变量的情况
            var_name_len = len(var_name_list)
            for j, var_name in enumerate(var_name_list):
                real_var_name = var_name
                if '${' in var_name:  # 当变量为${${a}}代表嵌套变量，这种格式的时候走此分支
                    real_var_name += '}'
                    pattern = re.escape(real_var_name) + r"(.*?)}"
                    real_var_name += re.findall(pattern, v)[0]  # 补齐字段
                    var_name = str(parse_param_value(real_var_name, params, i))
                name_list = var_name.split('.')  # 获取父子级参数
                res = get_parm_v_by_temp(name_list, params, i)

                if not res:
                    if var_name == 'i':  # i为固定变量
                        res = {'value': i}
                    else:
                        raise Exception("指定的变量不存在")
                res_value = res['value']
                # name_list只有一个,如果变量加上${}后与原字符串相等，所以直接赋值就可，不需要替换
                if j == 0 and 1 == var_name_len and (('${' + real_var_name + '}') == v):
                    v = res_value
                else:
                    if not isinstance(res_value, str):
                        res_value = str(res_value)
                    v = v.replace('${' + real_var_name + '}', res_value)
    elif isinstance(v, dict):
        v = {key: parse_param_value(v[key], params, i) for key in v}
    elif isinstance(v, list):
        v = [parse_param_value(_v, params, i) for _v in v]
    if is_eval:
        v = eval(v)
    return v


def parse_temp_params(temp_params):
    """
    解析临时参数
    """
    header, var, host = {'content-type': 'application/json'}, {}, None
    params_source = {key: {} for key in (HEADER_PARAM, VAR_PARAM, HOST_PARAM)}
    for parm in temp_params:
        p_name, p_value = parm['name'], parm['value']
        if (p_type := parm['type']) == HOST_PARAM:
            host = p_value
        elif p_type == VAR_PARAM:
            var[p_name] = p_value
        else:
            header[p_name] = p_value
        params_source[p_type][p_name] = parm
    return {'header': header, 'var': var, 'host': host, 'params_source': params_source}


def run_params_code(data, params, i, response=None, res_headers=None):
    """
    执行编写的代码
    """
    parse_data = 'def temp_func(var,response,res_headers,i):' if response else 'def temp_func(var,i):'
    for exp in data.split('\n'):
        parse_data += '\n\t' + exp
    try:
        exec(parse_data)
    except Exception as e:
        raise DiyBaseException('代码编译报错：' + str(e))
    stdout = sys.stdout
    sys.stdout = SavePrintContent()
    res = locals()['temp_func'](params, response, res_headers, i) if response else locals()['temp_func'](params, i)
    text_area, sys.stdout = sys.stdout, stdout
    print_content = ''
    for content in text_area.buffer:
        print_content += content[0]
    return res


def set_user_temp_params(params, user_id):
    """
    设置用户临时参数
    """

    change_params_objs, no_change_param_ids = [], []
    for key, v in params.items():
        for parm in v.values():
            if parm_id := parm.get('id'):
                no_change_param_ids.append(parm_id)
            else:
                change_params_objs.append(UserTempParams(**parm))
    UserTempParams.objects.filter(Q(user_id=user_id), ~Q(id__in=no_change_param_ids)).delete()
    UserTempParams.objects.bulk_create(change_params_objs)

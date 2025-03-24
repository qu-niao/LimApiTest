import datetime
import time

from django.db import transaction, IntegrityError
from django.db.models import F, Value, JSONField
from django.db.models.functions import Concat

from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apiData.models import ApiModule, ApiData, ApiCase
from apiData.viewDef import ApiCasesActuator
from comMethod.comDef import db_connect, get_proj_envir_db_data, close_db_con
from comMethod.constant import API, DB, DEFAULT_MODULE_NAME, SUCCESS, API_HOST, API_SQL, VAR_PARAM
from comMethod.paramsDef import set_user_temp_params
from comMethod.views import LimView
from conf.models import ConfEnvir
from project.models import Project, ProjectEnvirData
from project.serializers import ProjectSerializer
from user.models import UserTempParams


class ProjectView(LimView):
    serializer_class = ProjectSerializer
    queryset = Project.objects.order_by('-created')

    @staticmethod
    def get_envir_data(request, proj_id):
        envir_dict = {}
        for key in request.data:
            if key.startswith('envir'):
                envir_id, name = key.split('_')[1:]
                if envir_id not in envir_dict:
                    envir_dict[envir_id] = {'envir_id': int(envir_id), 'project_id': proj_id, 'data': {}}
                if name == DB:
                    envir_dict[envir_id]['data'][name] = {v['db_con_name']: v for v in request.data[key]}
                else:
                    envir_dict[envir_id]['data'][name] = request.data[key]
        return [ProjectEnvirData(**v) for v in envir_dict.values()]

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                proj = Project.objects.create(name=request.data['name'], remark=request.data.get('remark'))
                envir_data = self.get_envir_data(request, proj.id)
                ProjectEnvirData.objects.bulk_create(envir_data)
                ApiModule.objects.create(name=DEFAULT_MODULE_NAME, project_id=proj.id)
        except Exception as e:
            if '1062' in str(e):
                return Response({'msg': '已存在同名项目！'}, status=status.HTTP_400_BAD_REQUEST, headers={})
            return Response(data={'msg': f"执行出错:{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'msg': '创建成功！', 'id': proj.id})

    def patch(self, request, *args, **kwargs):
        envir_data = self.get_envir_data(request, request.data['id'])
        try:
            with transaction.atomic():
                ProjectEnvirData.objects.filter(project_id=request.data['id']).delete()
                ProjectEnvirData.objects.bulk_create(envir_data)
        except Exception as e:
            return Response(data={'msg': f"执行出错:{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        return self.partial_update(request, *args, **kwargs)


@api_view(['GET'])
def project_overview(request):
    """
    项目概览页
    """
    view_type = request.query_params['type']
    pro_dict = {}
    total_count = 0
    if view_type == API:
        data = ApiData.objects.values('id', 'project_id', 'project__name')
        for v in data:
            if (pro_id := v['project_id']) not in pro_dict:
                pro_dict[pro_id] = {'name': v['project__name'], 'count': 0}
            pro_dict[pro_id]['count'] += 1
            total_count += 1
    res_data = {'total_count': total_count, 'data': [
        {'id': key, 'name': pro_dict[key]['name'], 'count': pro_dict[key]['count']} for key in pro_dict]}
    return Response(data=res_data)


@api_view(['GET'])
def get_project_envir_data(request):
    """
    获取项目环境配置
    """
    project_id = request.query_params.get('id')
    envir = ConfEnvir.objects.annotate(data=Value([], output_field=JSONField())).values('id', 'name', 'data')
    if project_id:
        envir = {v['id']: v for v in envir}
        pro_envir = ProjectEnvirData.objects.filter(
            project_id=project_id).annotate(name=F('envir__name')).values('envir_id', 'name', 'data')
        for v in pro_envir:
            envir[v['envir_id']]['data'] = v['data']
        return Response(data=list(envir.values()))
    return Response(data=envir)


@api_view(['GET'])
def get_project_have_envir(request):
    """
    获取配置了指定环境参数的项目
    """
    _type = request.query_params['type']
    pro_data = {pro['id']: {**pro, **{'disabled': True}} for pro in Project.objects.values('id', 'name')}
    envir_data = ProjectEnvirData.objects.filter(data__isnull=False, envir_id=1).annotate(
        name=F('project__name')).values('name', 'data', 'project_id')

    if _type == API_HOST:
        for v in envir_data:
            if v['data'] and v['data'].get(API_HOST):
                pro_data[v['project_id']]['disabled'] = False
    elif _type == API_SQL:
        for v in envir_data:
            if v['data'] and v['data'].get('db'):
                pro_data[v['project_id']]['disabled'] = False
                pro_data[v['project_id']]['children'] = [{'id': key, 'name': key} for key in v['data']['db'].keys()]
    return Response(list(pro_data.values()))


@api_view(['POST'])
def test_db_connect(request):
    """
    测试数据库连接
    """
    res = db_connect(request.data)
    if res['status'] == SUCCESS:
        res['db_con'].close()
        res['ssh_server'] and res['ssh_server'].close()
        return Response({'msg': '连接成功'})
    return Response({'msg': res['results']}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def get_proj_db_database(request):
    """
    获取数据库连接的所有数据库
    """
    db_data = get_proj_envir_db_data(request.data['db'], user_id=request.user.id)
    if db_data:
        res = db_connect(db_data)
        if res['status'] == SUCCESS:
            res['db_con'].execute('SHOW DATABASES')
            sql_data = [{'id': db['Database'], 'name': db['Database']} for db in res['db_con'].fetchall()]
            close_db_con(res)
            return Response(sql_data)
        return Response({'msg': res['results']}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'msg': '无效的连接！'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def run_sql(request):
    req_data, user_id = request.data, request.user.id
    case_obj = ApiCasesActuator(
        user_id, temp_params=UserTempParams.objects.filter(user_id=user_id, type=VAR_PARAM).values())
    res = case_obj.sql(step=req_data)
    if res['status'] == SUCCESS:
        set_user_temp_params(case_obj.params_source, user_id)
        return Response(res['data'])
    res['msg'] = res.pop('results')
    return Response(data=res, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_index_statistics(request):
    """
    获取首页统计数据
    """
    now_time = time.mktime(datetime.date.today().timetuple())

    res_data = {
        'project_new_count': 0, 'api_count': 0, 'api_new_count': 0, 'case_count': 0, 'case_new_count': 0,
        'api_data': {}, 'case_data': {}}
    proj_data = Project.objects.values('id', 'created').order_by('-created')
    api_data = ApiData.objects.annotate(project_name=F('project__name')).values('created', 'project_name')
    case_data = ApiCase.objects.annotate(creater_name=Concat(
        'creater__real_name', Value('-'), 'creater__username')).filter(
        is_deleted=False).values('created', 'creater_name')

    res_data['project_count'] = len(proj_data)
    for proj in proj_data:
        if time.mktime(proj['created'].timetuple()) > now_time:
            res_data['project_new_count'] += 1
        else:
            break
    for api in api_data:
        if time.mktime(api['created'].timetuple()) > now_time:
            res_data['api_new_count'] += 1
        res_data['api_count'] += 1
        res_data['api_data'].setdefault(api['project_name'], 0)
        res_data['api_data'][api['project_name']] += 1
    res_data['api_data'] = [
        {'name': proj_name, 'count': res_data['api_data'][proj_name]} for proj_name in res_data['api_data'].keys()]
    for case in case_data:
        if time.mktime(case['created'].timetuple()) > now_time:
            res_data['case_new_count'] += 1
        res_data['case_count'] += 1
        res_data['case_data'].setdefault(case['creater_name'], 0)
        res_data['case_data'][case['creater_name']] += 1
    res_data['case_data'] = [
        {'name': c_name, 'count': res_data['case_data'][c_name]} for c_name in res_data['case_data'].keys()]
    return Response(res_data)

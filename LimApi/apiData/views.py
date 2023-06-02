import datetime

from django.db import IntegrityError, transaction
from django.db.models import Value, F, Q, Max
from django.db.models.functions import Concat
from django.utils import timezone
from rest_framework import status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apiData.models import ApiCaseModule, ApiCase, ApiModule, ApiData, ApiCaseStep, ApiForeachStep
from apiData.serializers import CaseModuleSerializer, ApiCaseListSerializer, ApiModuleSerializer, ApiCaseSerializer, \
    ApiDataListSerializer
from apiData.viewDef import save_api, parse_api_case_steps, run_api_case_func, ApiCasesActuator, \
    parse_create_foreach_steps, go_step, monitor_interrupt, copy_cases_func
from comMethod.comDef import get_next_id, MyThread, get_module_related, get_case_sort_list
from comMethod.constant import DEFAULT_MODULE_NAME, USER_API, API, FAILED, API_CASE, API_FOREACH, SUCCESS, RUNNING, \
    WAITING, VAR_PARAM, INTERRUPT
from comMethod.diyException import CaseCascaderLevelError
from comMethod.paramsDef import set_user_temp_params
from comMethod.report import get_api_case_step_count, report_case_count, init_step_count
from comMethod.treeDef import create_tree, create_cascader_tree
from comMethod.views import LimView
from conf.models import ConfEnvir
from user.models import UserCfg, UserTempParams, LimUser


class CaseModuleViews(LimView):
    queryset = ApiCaseModule.objects.order_by('created')
    serializer_class = CaseModuleSerializer
    ordering_fields = ('created',)

    def post(self, request, *args, **kwargs):
        request.data['id'] = get_next_id(ApiCaseModule, 'ACM')
        return self.save_related_module(request.data, ApiCaseModule)

    def delete(self, request, *args, **kwargs):
        return self.delete_logically_module(request, ApiCase, *args, **kwargs)


class ApiModuleViews(LimView):
    queryset = ApiModule.objects.order_by('created')
    serializer_class = ApiModuleSerializer
    ordering_fields = ('created',)

    def post(self, request, *args, **kwargs):
        request.data['id'] = get_next_id(ApiModule, 'APM')
        return self.save_related_module(request.data, ApiModule)


@api_view(['GET'])
def tree_case_module(request):
    """
    用例模块树
    """
    return Response(data=create_tree(request, ApiCaseModule, ['module_related']))


@api_view(['GET'])
def tree_cascader_module_case(request):
    """
    测试模块带用例的树
    """
    return create_cascader_tree(request, ApiCaseModule, ApiCase, extra_filter={'is_deleted': 0})


@api_view(['GET'])
def tree_api_module(request):
    """
    用例模块树
    """
    return Response(data=create_tree(request, ApiModule, ['module_related'], order_fields=['created']))


class ApiCaseViews(LimView):
    queryset = ApiCase.objects.order_by(
        'position', '-updated').select_related('creater', 'updater')
    query_only_fields = (
        'id', 'name', 'creater', 'updater', 'updated', 'created', 'status', 'latest_run_time')
    serializer_class = {'list': ApiCaseListSerializer, 'detail': ApiCaseSerializer}
    diy_search_fields = ('name',)
    filterset_fields = ('module_id', 'status', 'is_deleted')
    ordering_fields = ('created', 'name', 'updated', 'latest_run_time')

    def get(self, request, *args, **kwargs):
        req_params = request.query_params.dict()
        # api_id查关联接口的时候用
        case_id, api_id = req_params.get('id'), req_params.get('api_id')
        if case_id:  # 有case_id代表请求详情
            instance = ApiCase.objects.defer('report_data').get(id=case_id)
            serializer = ApiCaseSerializer(instance, context={'api_id': api_id, 'user_id': request.user.id})
            return Response(data=serializer.data)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        req_data = request.data
        case_id, steps, for_next_id = req_data.get('id'), req_data.get('steps'), None
        save_case_data = {field: req_data.get(field) for field in ('name', 'module_id', 'remark')
                          if field in req_data}
        try:
            with transaction.atomic():
                if case_id:  # 代表修改用例
                    save_case_data.update({'updater_id': request.user.id, 'updated': datetime.datetime.now()})
                    ApiCase.objects.filter(id=case_id).update(**save_case_data)
                else:
                    case = ApiCase.objects.create(**save_case_data)
                    case_id = case.id
                steps_objs, foreach_steps = [], []
                have_foreach = False
                for step in steps:
                    step.update({'case_id': case_id, 'retried_times': 0})
                    step.pop('id', None)
                    step.pop('is_relation', None)
                    if (s_type := step['type']) == API:
                        step['api_id'] = step['params']['api_id']
                    elif s_type == API_CASE:
                        step['quote_case_id'] = step['params']['case_related'][-1]
                    elif s_type == API_FOREACH:
                        have_foreach = True
                        foreach_steps.append({'steps': step['params'].pop('steps')})
                    steps_objs.append(ApiCaseStep(**step))
                if have_foreach:
                    for_next_id = (ApiForeachStep.objects.aggregate(Max('id')).get('id__max') or 0) + 1
                ApiCaseStep.objects.filter(case_id=case_id).delete()
                ApiCaseStep.objects.bulk_create(steps_objs)
                if have_foreach:
                    foreach_step_ids = ApiCaseStep.objects.filter(
                        case_id=case_id, type=API_FOREACH).values_list('id', flat=True).order_by('id')
                    for i, foreach_step in enumerate(foreach_steps):
                        foreach_step['step_id'] = foreach_step_ids[i]
                    save_step_objs = []
                    for foreach_step in foreach_steps:  # foreach_step=[...'steps':{xx}]
                        for_next_id = parse_create_foreach_steps(
                            save_step_objs, foreach_step['steps'], foreach_step['step_id'], for_next_id)
                    ApiForeachStep.objects.bulk_create(save_step_objs)
        except Exception as e:
            print('err', e.__traceback__.tb_lineno)
            if '1062' in str(e):
                return Response(data={'msg': '该用例名已存在！'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data={'msg': '保存出错：' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'msg': '保存成功！', 'case_id': case_id})

    def delete(self, request, *args, **kwargs):
        if request.data.get('real_delete'):
            # self.queryset = ApiCase.objects.all()
            return self.destroy(request, *args, **kwargs)
        api_plan_name = f"{self.get_object().name}{str(timezone.now().timestamp())}"
        request.data.clear()
        request.data.update({'name': api_plan_name, 'is_deleted': True, 'updater': request.user.id})
        return self.patch(request, *args, **kwargs)


class ApiViews(LimView):
    queryset = ApiData.objects.order_by(
        '-updated').select_related('creater', 'updater')
    serializer_class = ApiDataListSerializer
    filterset_fields = ('module_id', 'name', 'status', 'method')
    ordering_fields = ('created', 'name', 'updated')

    def get(self, request, *args, **kwargs):
        req_params = request.query_params.dict()
        api_id, is_case = req_params.get('id'), req_params.get('is_case')
        if api_id:  # 传递了case_id代表查详情
            extra_annotate, extra_fields = {}, []
            if not is_case:  # 代表需要接口的default测试数据
                extra_annotate, extra_fields = {'params': F('default_params')}, ('params',)
            api_data = ApiData.objects.filter(id=api_id).annotate(
                api_id=F('id'), load_name=Concat('project__name', Value('-'), 'name', Value('-'), 'path'),
                **extra_annotate).values('api_id', 'name', 'load_name', 'path', 'timeout',
                                         'method', 'project_id', 'source', *extra_fields).first()
            if not api_data:
                return Response(data={'msg': '请求接口已被删除！请重新选择！'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data=api_data)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        req_data = request.data
        is_case = req_data.get('is_case')
        req_data['module_id'] = ApiModule.objects.filter(
            project_id=req_data['project_id'], name=DEFAULT_MODULE_NAME).values_list('id', flat=True)
        if is_case:
            api_data = ApiData.objects.filter(
                project_id=req_data['project_id'], path=req_data['path'], method=req_data['method']).values(
                'id', 'source').first() or {}
            api_id, source = api_data.get('id'), api_data.get('source', USER_API)
        else:
            api_id = req_data.get('api_id')
            source = ApiData.objects.filter(id=api_id).values_list('source', flat=True).first() if api_id else None
        try:
            used_api_id = save_api(req_data, api_id, source)  # 存储测试数据和基础测试用例
        except IntegrityError:
            return Response(data={'msg': '该接口已在项目中存在！'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(data={'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data={'msg': '保存成功！', 'results': {'api_id': used_api_id}})


@api_view(['GET'])
def search_api(request):
    """
    搜索接口
    """
    req_params = request.query_params.dict()
    case_data = ApiData.objects.filter(
        Q(name__icontains=req_params['search']) | Q(path__icontains=req_params['search'])).annotate(
        api_id=F('id'), value=Concat('project__name', Value('-'), 'name', Value('-'), 'path', Value('-'), 'method'),
        label=Concat('project__name', Value('-'), 'name', Value('-'), 'path', Value('-'), 'method')).values(
        'value', 'label', 'api_id')
    return Response(data=case_data)


@api_view(['POST'])
def run_api_cases(request):
    """
    执行Api测试用例
    """
    user_id, envir = request.user.id, request.data['envir']
    case_data = parse_api_case_steps(request.data['case'])
    UserCfg.objects.update_or_create(user_id=user_id, defaults={'exec_status': RUNNING, 'envir_id': envir})
    try:
        res = run_api_case_func(case_data, user_id, cfg_data={'envir_id': request.data['envir']})
        UserCfg.objects.filter(user_id=user_id).update(exec_status=WAITING)
        set_user_temp_params(res['params_source'], user_id)
    except Exception as e:
        return Response(data={'msg': f"执行异常：{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(data={'msg': "执行完成！"})


@api_view(['POST'])
def run_api_case_step(request):
    """
    执行api用例步骤
    """
    req_data = request.data
    user_id = request.user.id
    actuator_obj = ApiCasesActuator(user_id)
    s_type = req_data['type']
    try:
        UserCfg.objects.filter(user_id=user_id).update(exec_status=RUNNING)
        if s_type in (API_CASE, API_FOREACH):
            thread = MyThread(target=monitor_interrupt, args=[user_id, actuator_obj])
            thread.start()
        res = go_step(actuator_obj, s_type, req_data, i=0)
    except CaseCascaderLevelError as e:
        return Response(data={'status': FAILED, 'msg': str(e)})
    res_msg = ''
    if res['status'] != SUCCESS:
        if s_type in (API_CASE, API_FOREACH):
            res_msg = '请前往步骤详情中查看失败或跳过原因！'
        elif isinstance(res['results'], dict):
            res_msg = res['results'].get('msg')
        else:
            res_msg = str(res['results'])
    UserCfg.objects.filter(user_id=user_id).update(exec_status=WAITING)
    set_user_temp_params(actuator_obj.params_source, request.user.id)
    return Response({'msg': res_msg, 'results': {'status': res['status'], 'retried_times': res.get('retried_times'),
                                                 'results': res.get('results')}})


@api_view(['POST'])
def stop_casing(request):
    """
    中断测试
    """
    UserCfg.objects.filter(user_id=request.user.id).update(exec_status=INTERRUPT)
    return Response({'msg': '中断成功，请等待几秒后刷新列表查看！'})


@api_view(['POST'])
def copy_cases(request):
    """
    复制用例
    """
    return copy_cases_func(request, ApiCase, ApiCaseStep)


@api_view(['POST'])
def merge_cases(request):
    """
    合并用例
    """
    req_data = request.data
    try:
        cases = ApiCase.objects.filter(id__in=req_data['case_ids']).values('id', 'name', 'module_id')
        case_dict = {case['id']: case for case in cases}
        merge_case = ApiCase.objects.create(
            name=req_data['name'], creater_id=request.user.id, module_id=req_data['module_id'])
        step_objs = []
        for case_id in req_data['case_ids']:
            case = case_dict[case_id]
            mod_related = get_module_related(ApiCaseModule, case['module_id'], [case_id])
            step_objs.append(ApiCaseStep(
                step_name=case['name'], type=API_CASE, status=WAITING, case_id=merge_case.id,
                params={'case_related': mod_related}))
        ApiCaseStep.objects.bulk_create(step_objs)
    except IntegrityError as e:
        print(str(e))
        return Response(data={'msg': '该测试用例已存在！'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(data={'msg': "合并成功！"})


@api_view(['POST'])
def copy_step_to_other_case(request):
    """
    复制测试用例中的某个步骤到其他测试用例下
    """
    params = request.data
    ApiCaseStep.objects.create(
        step_name=params['step_name'], type=params['type'],
        case_id=params['to_case'], status=WAITING, api_id=params.get('params', {}).get('api_id'),
        enabled=True, controller_data=params.get('controller_data', {}), params=params['params'])
    ApiCase.objects.filter(id=params['to_case']).update(updater_id=request.user.id, updated=datetime.datetime.now())
    return Response({'msg': '复制成功！'})


@api_view(['POST'])
def test_api_data(request):
    """
    调试API接口请求
    """
    req_data, user_id = request.data, request.user.id
    actuator_obj = ApiCasesActuator(user_id)
    req_data['type'] = API
    res = go_step(actuator_obj, API, req_data, i=0)
    UserCfg.objects.filter(user_id=user_id).update(exec_status=WAITING)
    set_user_temp_params(actuator_obj.params_source, request.user.id)
    return Response(res.get('results', {}))


@api_view(['GET'])
def search_case_by_api(request):
    """
    查询使用了指定接口的用例
    """
    if 'api_id' in request.query_params:
        api_id = int(request.query_params['api_id'])
        case_ids = list(ApiCaseStep.objects.filter(api_id=api_id).values_list('case_id', flat=True))
        case_ids += list(ApiForeachStep.objects.filter(api_id=api_id).annotate(case_id=F('step__case_id')).values_list(
            'case_id', flat=True))
        serializer = ApiCaseListSerializer(
            ApiCase.objects.filter(id__in=set(case_ids)), many=True, context={'request': request})
        ser_data = serializer.data
        return Response({'data': ser_data, 'total': len(ser_data)})
    return Response({'data': {}})


@api_view(['GET'])
def get_api_report(request):
    """
    获取api报告
    """
    case_data = ApiCase.objects.filter(
        id=request.query_params['case_id']).values('name', 'report_data').first() or {}
    report_data = case_data.get('report_data')
    if report_data:
        envir_name = ConfEnvir.objects.filter(id=report_data['envir']).values_list('name', flat=True).first()
        report_data.update(
            {'case_count': 0, 'envir_name': envir_name, 'name': case_data['name'], 'step_count': init_step_count(),
             'cases': {}})
        get_api_case_step_count(report_data['steps'], report_data)
        if report_cases := report_data['cases']:
            case_ids = list(report_cases.keys())
            _data = ApiCase.objects.filter(id__in=case_ids).values('id', 'name')
            case_name_dict = {v['id']: v['name'] for v in _data}
            report_data['case_count'] = len(case_ids)
            try:
                report_case_count(case_ids, report_cases, case_name_dict, report_data)
            except IndexError as e:
                return Response(data={'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data=report_data)
        return Response(data={'msg': "该用例没有步骤！"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(data={'msg': "无该用例的测试报告！"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def case_sort_list(request):
    """
    用例排序（简易）列表
    """
    return Response(get_case_sort_list(ApiCase, ApiModule, request))


@api_view(['POST'])
def set_case_position(request):
    """
    用例排序列表
    """
    case_objs = []
    for i, case in enumerate(request.data['cases']):
        case_objs.append(ApiCase(position=i, id=case['id']))
    ApiCase.objects.bulk_update(case_objs, fields=('position',))
    return Response({'msg': '修改成功'})


@api_view(['DELETE'])
def clean_deleted_cases(request):
    """
    清空回收站
    """
    ApiCase.objects.filter(is_deleted=True).delete()
    return Response({'msg': '清空成功！'})

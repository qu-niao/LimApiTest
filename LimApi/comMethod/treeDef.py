from rest_framework.response import Response


def set_cascader_disabled(data):
    """
    判断模块是否有级联
    """
    for v in data:
        if 'children' in v:
            # 代表模块且模块有子级
            if v['children']:
                set_cascader_disabled(v['children'])
            # 代表模块无子级，所以要禁用
            else:
                v['disabled'] = True


def set_cascader_tree(_list, module_cases: dict):
    """
    生成级联（模块-用例）树，无级联的模块需要禁用
    """
    _dict, tree = {}, []
    if module_cases:  # 公共模块需要一次性返回模块下的用例
        for i in _list:  # i=module_data
            _dict[i['id']] = i
            i['children'] = module_cases.get(i['id'], [])
    else:
        for i in _list:
            _dict[i['id']] = i
            i['children'] = []
            i['disabled'] = True
    for i in _list:
        node = i
        if node['parent_id'] is not None:
            _dict[node['parent_id']]['children'].append(node)
        else:
            tree.append(node)
    if module_cases:
        set_cascader_disabled(tree)
    return tree


def set_tree(_list):
    """
    生成树
    """
    _dict, tree = {}, []
    for i in _list:
        _dict[i['id']] = i
        i['children'] = []
    for node in _list:
        if node['parent_id'] is not None:
            _dict[node['parent_id']]['children'].append(node)
        else:
            tree.append(node)
    return tree


def create_tree(request, model, extra_fields=None, order_fields=None):
    """
    模块树
    """
    extra_fields = extra_fields or []
    order_fields = order_fields or ['name']
    req_params = request.query_params.dict()
    data_list = model.objects.filter(**req_params).values('id', 'parent_id', 'name', *extra_fields).order_by(
        *order_fields)
    data_list = set_tree(data_list)
    return data_list


def create_cascader_tree(request, model, data_model, extra_filter=None):
    """
    公共模块树+用例和测试计划树+计划的树生成方法
    """
    extra_filter = extra_filter or {}
    req_params = request.query_params.dict()
    data_list = model.objects.filter(**req_params).values('id', 'parent_id', 'name')
    module_ids = [mod_id['id'] for mod_id in data_list]
    detail_data = data_model.objects.filter(
        module_id__in=module_ids, **extra_filter).values('id', 'name', 'module_id').order_by('id')
    module_cases = {mod_id: [] for mod_id in module_ids}
    for data in detail_data:
        module_cases[data['module_id']].append(data)
    data_list = set_cascader_tree(data_list, module_cases)
    return Response(data=data_list)

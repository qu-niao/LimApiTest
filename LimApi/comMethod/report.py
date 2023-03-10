from comMethod.constant import SUCCESS, SKIP, DISABLED, INTERRUPT, API_CASE, API_TYPE_LABEL


def calculate_step_status_and_type(data, status, run_type):
    """
    统计不同状态及类型下的步骤数量
    """
    status_count, type_count = data['sp_status_count'], data['sp_type_count']
    if status == SUCCESS:
        status_count['success'] += 1
    elif status == DISABLED:
        status_count['disabled'] += 1
    elif status in (SKIP, INTERRUPT):
        status_count['skip'] += 1
    else:
        status_count['fail'] += 1
    type_count.setdefault(run_type, 0)
    type_count[run_type] += 1


def init_step_count():
    """
    初始化步骤数据
    """
    return {'total_count': 0, 'sp_status_count': {key: 0 for key in ('success', 'fail', 'skip', 'disabled')},
            'sp_type_count': {}}


def get_api_case_step_count(steps, report_data):
    """
    获取用例里的步骤数量
    """

    for step in steps:
        case_id, run_type, status = step.get('case_id'), step['type'], step['status']
        if run_type == API_CASE:  # 如果计划下没有非计划步骤，该计划则不会计入报告数量统计中
            step_res = step.get('results') or []
            if isinstance(step_res, str):  # 死循环和控制器报错时，results为字符串
                step_res = []
            get_api_case_step_count(step_res, report_data)
        else:
            if not report_data['cases'].get(case_id):
                report_data['cases'][case_id] = init_step_count()
            calculate_step_status_and_type(report_data['cases'][case_id], status, run_type)


def report_case_count(case_ids, report_cases, case_name_dict, report_data):
    """
    用例各状态步骤数量统计
    """
    _list = []
    for c_id in case_ids:
        case_name = case_name_dict.get(c_id, '未知用例（可能已被删除）')
        case_status_count, case_type_count = report_cases[c_id]['sp_status_count'], report_cases[c_id]['sp_type_count']
        for status, label in {'fail': '失败', 'success': '成功', 'disabled': '禁用', 'skip': '跳过'}.items():
            _list.append({'value': case_status_count[status], 'type': label, 'name': case_name})
            report_data['step_count']['sp_status_count'][status] += case_status_count[status]
            report_data['step_count']['total_count'] += case_status_count[status]

        for _type in API_TYPE_LABEL.keys():
            if case_type_count.get(_type):
                report_data['step_count']['sp_type_count'].setdefault(_type, 0)
                report_data['step_count']['sp_type_count'][_type] += case_type_count[_type]
    report_data['cases'] = _list

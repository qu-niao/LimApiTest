from comMethod.constant import SUCCESS, SKIP, DISABLED, INTERRUPT


def calculate_step_status(data, status):
    """
    统计不同状态下的步骤数量
    """
    if status in SUCCESS:
        data['success_count'] += 1
    elif status == DISABLED:
        data['disabled_count'] += 1
    elif status in (SKIP, INTERRUPT):
        data['skip_count'] += 1
    else:
        data['fail_count'] += 1


def get_api_case_step_count(steps, report_data, p_type_key='plan'):
    """
    获取用例里的步骤数量
    """

    for step in steps:
        case_id, run_type, status = step.get('case_id'), step['type'], step['status']
        if run_type == 'case':  # 如果计划下没有非计划步骤，该计划则不会计入报告数量统计中
            step_res = step.get('results') or []
            if isinstance(step_res, str):  # 死循环和控制器报错时，results为字符串
                step_res = []
            get_api_case_step_count(step_res, report_data, p_type_key)
        else:
            if not report_data[p_type_key].get(case_id):
                report_data[p_type_key][case_id] = {
                    'skip_count': 0, 'fail_count': 0, 'success_count': 0, 'disabled_count': 0}
            calculate_step_status(report_data[p_type_key][case_id], status)
def report_plan_count(plan_ids, report_plan, plan_name_dict, report_data, p_type_key='plan'):
    """
    用例各状态步骤数量统计
    """
    plan_list = []
    for key in plan_ids:
        plan_name = plan_name_dict.get(key, '未知计划（可能已被删除）')
        plan_list.append(
            {'value': report_plan[key]['fail_count'], 'type': '失败', 'name': plan_name})
        plan_list.append(
            {'value': report_plan[key]['success_count'], 'type': '成功', 'name': plan_name})
        plan_list.append(
            {'value': report_plan[key]['disabled_count'], 'type': '禁用', 'name': plan_name})
        plan_list.append(
            {'value': report_plan[key]['skip_count'], 'type': '跳过', 'name': plan_name})
        report_data['fail_count'] += report_plan[key]['fail_count']
        report_data['success_count'] += report_plan[key]['success_count']
        report_data['disabled_count'] += report_plan[key]['disabled_count']
        report_data['skip_count'] += report_plan[key]['skip_count']
    # 接口测试计划只有plan维度，任务的话存在多维度，所以需要指定p_type_key
    report_data[p_type_key] = plan_list

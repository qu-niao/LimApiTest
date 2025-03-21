from django.db import models

from comMethod.comDef import get_next_id
from comMethod.comModel import ComTimeModel, ComModuleModel
from comMethod.constant import WAITING, USER_API
from project.models import Project
from user.models import UserEditModel


class ApiModule(ComTimeModel, ComModuleModel):
    project = models.ForeignKey(to=Project, default=1, verbose_name="关联项目", on_delete=models.CASCADE)

    class Meta:
        verbose_name = '用例模块'
        db_table = 'api_module'

    unique_together = ('project', 'name')

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = get_next_id(ApiModule, 'APM')
        super(ApiModule, self).save(*args, **kwargs)


class ApiData(ComTimeModel, UserEditModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, default='', verbose_name="接口名称")
    path = models.CharField(max_length=255, verbose_name="接口地址")
    method = models.CharField(max_length=16, verbose_name="请求方法")
    status = models.IntegerField(default=WAITING, verbose_name="执行结果")
    project = models.ForeignKey(to=Project, default=1, on_delete=models.PROTECT, verbose_name="所属项目")
    default_params = models.JSONField(null=True, verbose_name="默认参数")
    timeout = models.SmallIntegerField(null=True, verbose_name="接口请求超时时间")
    module = models.ForeignKey(to=ApiModule, default=1, on_delete=models.PROTECT, verbose_name="所属模块")
    source = models.SmallIntegerField(default=USER_API, verbose_name="接口来源")

    class Meta:
        verbose_name = 'api用例'
        db_table = 'api_data'
        unique_together = ('project', 'path', 'method')


class ApiCaseModule(ComTimeModel, ComModuleModel):
    name = models.CharField(max_length=100, verbose_name="模块名称")
    position = models.IntegerField(default=0, verbose_name='排序优先级')

    class Meta:
        verbose_name = '用例模块'
        db_table = 'api_case_module'


class ApiCase(ComTimeModel, UserEditModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name="测试用例名称")
    module = models.ForeignKey(to=ApiCaseModule, on_delete=models.PROTECT, verbose_name="所属模块")
    status = models.IntegerField(default=WAITING, verbose_name="执行结果")
    remark = models.TextField(null=True, verbose_name="用例备注")
    report_data = models.JSONField(null=True, verbose_name="测试报告数据")
    is_deleted = models.BooleanField(default=0, verbose_name="是否删除")
    latest_run_time = models.DateTimeField(null=True, verbose_name='最后一次执行时间')
    position = models.IntegerField(default=0, verbose_name='排序优先级')

    class Meta:
        verbose_name = '接口用例'
        db_table = 'api_case'
        unique_together = ('name', 'module')


class ComCaseStepModel(models.Model):
    id = models.AutoField(primary_key=True)
    step_name = models.CharField(default='', max_length=255, verbose_name="步骤名称")
    type = models.CharField(default='case', max_length=255,
                            verbose_name="执行参数类型(1.api2.case；3.SQL 4.header（取value） 5.var 6.host)")
    status = models.IntegerField(default=WAITING, verbose_name="执行状态")
    params = models.JSONField(null=True, verbose_name="步骤参数")
    api = models.ForeignKey(null=True, to=ApiData, on_delete=models.PROTECT, verbose_name="步骤使用了的接口")
    enabled = models.BooleanField(default=True, verbose_name="是否启用")
    controller_data = models.JSONField(null=True, verbose_name="步骤控制器")
    quote_case = models.ForeignKey(null=True, to=ApiCase, related_name='%(class)s_quote_case',
                                   on_delete=models.PROTECT, verbose_name="引用的测试用例")
    retried_times = models.SmallIntegerField(null=True, verbose_name="重试了几次")

    class Meta:
        abstract = True


class ApiCaseStep(ComCaseStepModel):
    id = models.AutoField(primary_key=True)
    case = models.ForeignKey(to=ApiCase, related_name='case_step', on_delete=models.CASCADE, verbose_name="所属测试用例")
    results = models.JSONField(null=True, verbose_name="步骤执行结果")

    class Meta:
        verbose_name = 'api用例的步骤'
        db_table = 'api_case_step'


class ApiForeachStep(ComCaseStepModel):
    step = models.ForeignKey(to=ApiCaseStep, on_delete=models.CASCADE, verbose_name="所属测试用例")
    parent = models.ForeignKey(null=True, to='self', on_delete=models.CASCADE, verbose_name="父循环步骤")

    class Meta:
        verbose_name = 'api用例循环控制器步骤'
        db_table = 'api_foreach_step'

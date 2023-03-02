from django.db import models

from comMethod.comModel import ComTimeModel
from conf.models import ConfEnvir


class Project(ComTimeModel):
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=32, unique=True, verbose_name="项目名称")
    remark = models.TextField(null=True, verbose_name="备注")

    class Meta:
        verbose_name = '项目表'
        db_table = 'project'


class ProjectEnvirData(models.Model):
    id = models.SmallAutoField(primary_key=True)
    envir = models.ForeignKey(
        to=ConfEnvir, default=1, related_name='pro_data_envir', on_delete=models.PROTECT, verbose_name="关联环境")
    project = models.ForeignKey(to=Project, default=1, on_delete=models.CASCADE, verbose_name="关联项目")
    data = models.JSONField(null=True, verbose_name="环境配置项")

    class Meta:
        verbose_name = '项目表'
        db_table = 'project_envir_data'
        unique_together = ('envir', 'project')

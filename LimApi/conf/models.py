from django.db import models
from comMethod.comModel import ConfModel


class ConfEnvir(ConfModel):
    name = models.CharField(max_length=100, unique=True, verbose_name="名称")

    class Meta:
        verbose_name = '环境配置字典表'
        db_table = 'conf_envir'
        ordering = ('position',)


class ConfParamType(ConfModel):
    id = models.CharField(primary_key=True, max_length=8)

    class Meta:
        verbose_name = '参数类型表'
        db_table = 'conf_param_type'
        ordering = ('position',)




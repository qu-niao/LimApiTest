from django.db import models


class ComTimeModel(models.Model):
    """
   公共模型
    """
    created = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated = models.DateTimeField(auto_now=True, verbose_name='修改时间', null=True)

    class Meta:
        abstract = True


class ComModuleModel(models.Model):
    """
    公共模块模型
    """
    id = models.CharField(max_length=12, primary_key=True)
    name = models.CharField(max_length=100, verbose_name="模块名称")
    parent = models.ForeignKey(to='self', verbose_name="父模块", null=True, on_delete=models.DO_NOTHING)
    module_related = models.JSONField(default=[], verbose_name="所属模块级联关系（父子级）")

    class Meta:
        abstract = True


class ConfModel(models.Model):
    """
   公共字典模型
    """
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(max_length=100, verbose_name="名称")
    position = models.SmallIntegerField(default=1, verbose_name="排序")

    class Meta:
        abstract = True

from rest_framework import serializers


class ComEditUserNameSerializer(serializers.ModelSerializer):
    """
    公共创建/修改用户名返回序列化器
    """
    creater_name = serializers.CharField(source='creater.real_name', read_only=True)
    updater_name = serializers.CharField(source='updater.real_name', allow_null=True, read_only=True)

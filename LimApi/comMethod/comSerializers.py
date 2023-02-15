from rest_framework import serializers


class ComEditUserNameSerializer(serializers.ModelSerializer):
    """
    公共创建/修改用户名返回序列化器
    """
    creater_name = serializers.SerializerMethodField()
    updater_name = serializers.SerializerMethodField()

    def get_creater_name(self, obj):
        return obj.creater.last_name + obj.creater.first_name

    def get_updater_name(self, obj):
        if obj.updater:
            return obj.updater.last_name + obj.updater.first_name
        return '-'
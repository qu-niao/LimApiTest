from rest_framework import serializers

from conf.models import ConfEnvir


class EnvirSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfEnvir
        fields = '__all__'

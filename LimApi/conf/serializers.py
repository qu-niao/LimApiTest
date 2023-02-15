from rest_framework import serializers

from conf.models import ConfEnvir, ConfExpectRule


class EnvirSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfEnvir
        fields = '__all__'


class ExpectRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfExpectRule
        fields = '__all__'

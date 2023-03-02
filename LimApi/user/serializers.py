from rest_framework import serializers

from user.models import LimUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = LimUser
        fields = '__all__'

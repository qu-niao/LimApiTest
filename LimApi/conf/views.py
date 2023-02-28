from functools import lru_cache

from django.db.models import Max
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from comMethod.paramsDef import get_params_type_func
from comMethod.views import LimView
from conf.models import ConfEnvir
from conf.serializers import EnvirSerializer


class EnvirView(LimView):
    serializer_class = EnvirSerializer
    queryset = ConfEnvir.objects.all()

    def post(self, request, *args, **kwargs):
        max_id = (ConfEnvir.objects.aggregate(Max('position')).get('position__max') or 0)
        request.data['position'] = max_id + 1
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        envir_count = ConfEnvir.objects.count()
        if envir_count == 1:
            return Response({'msg': '必须保留至少一个环境！'}, status=status.HTTP_400_BAD_REQUEST)
        return self.destroy(request, *args, **kwargs)


@api_view(['POST'])
def change_envir_position(request):
    """
    改变环境的顺序
    """
    envir_obj = ConfEnvir.objects.get(id=request.data['id'])

    if request.data['type'] == 'up':
        new_position = envir_obj.position - 1 if envir_obj.position > 1 else 1
    else:
        max_id = (ConfEnvir.objects.aggregate(Max('position')).get('position__max') or 0)
        new_position = envir_obj.position + 1 if envir_obj.position < max_id else max_id
    ConfEnvir.objects.filter(position=new_position).update(position=envir_obj.position)
    envir_obj.position = new_position
    envir_obj.save(update_fields=['position'])
    return Response({'msg': '修改成功！'})


@api_view(['GET'])
def get_param_type(request):
    """
    获取参数类型字典
    """
    return Response(data=get_params_type_func())

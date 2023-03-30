import datetime

from django.db import IntegrityError
from rest_framework import mixins, status, exceptions

from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.response import Response

from comMethod.comDef import get_module_related
from comMethod.constant import PROTECT_CODE


class LimView(mixins.ListModelMixin,
              mixins.CreateModelMixin,
              mixins.UpdateModelMixin,
              mixins.DestroyModelMixin,
              mixins.RetrieveModelMixin,
              GenericAPIView):
    swagger_schema = None

    def initial(self, request, *args, **kwargs):
        """
        Runs anything that needs to occur prior to calling the method handler.
        """
        if (method := request.method) == 'POST':
            request.data.update({'creater': request.user.id, 'created': datetime.datetime.now()})
        elif method in ['PUT', 'PATCH']:
            request.data.update({'updater': request.user.id, 'updated': datetime.datetime.now()})
        super().initial(request, *args, **kwargs)

    def dispatch(self, request, *args, **kwargs):
        """
          重写restframework的视图方法
          增加详情序列化和简易序列化的切换
        """
        if isinstance(self.serializer_class, dict):
            if request.method == 'GET':
                # 有详情和list两个serializer的时候，list，指定了ID获取单个详情时，使用detail的ser
                self.serializer_class = self.serializer_class['detail' if getattr(self, 'kwargs', {}) else 'list']
            else:
                self.serializer_class = self.serializer_class['detail']
        return super().dispatch(request, *args, **kwargs)

    def get_object(self):
        """
        重写object，使得xx?id=1以及PATCH请求下的{"id":xx}能正确获取到对应的instance
        """
        data_id = self.request.query_params.get('id') or self.request.data.get('id')

        if data_id:
            self.lookup_field = 'pk'
            self.kwargs['pk'] = data_id
        return super().get_object()

    def get(self, request, *args, **kwargs):
        if request.query_params.get('id'):
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def delete_logically_module(self, request, model, *args, **kwargs):
        """
        删除元素为逻辑删除的模块
        """
        try:
            return self.destroy(request, *args, **kwargs)
        except IntegrityError:
            mod_id = request.parser_context['kwargs']['pk']
            plan_data = model.objects.filter(module_id=mod_id, is_deleted=False).first()
            if plan_data:
                raise IntegrityError(PROTECT_CODE)
            model.objects.filter(module_id=mod_id).delete()
            return self.destroy(request, *args, **kwargs)

    def save_related_module(self, req_data, model):
        serializer = self.get_serializer(data=req_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        mod_data = dict(serializer.data)
        mod_data['module_related'] = get_module_related(model, mod_data['id'], [])
        model.objects.filter(id=mod_data['id']).update(**mod_data)
        return Response(data={'msg': '创建成功！'})

from django.db.models import QuerySet
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status


class ResponseMiddleWare(MiddlewareMixin):
    async_capable = True
    sync_capable = True

    def process_response(self, request, response):
        """
        处理响应格式
        """
        if hasattr(response, 'data'):
            if response.data is not None:
                if isinstance(response.data, dict):
                    if 'code' not in response.data:
                        msg = response.data.pop('msg', '')
                        if 'results' in response.data:
                            response.data.update({'code': response.status_code, 'msg': msg})
                        else:
                            response.data = {'code': response.status_code, 'msg': msg, 'results': response.data}
                elif isinstance(response.data, (list, QuerySet)):
                    response.data = {'code': status.HTTP_200_OK, 'results': response.data, 'msg': ''}
            else:  # delete请求返回的数据没有data，所以下面的逻辑需要单独处理
                setattr(response, 'data', {'code': status.HTTP_200_OK})
            # 状态码为2开头的都视为成功，否则都是失败
            response.data['success'] = str(response.status_code).startswith('2')
            # 为了适配swagger接口文档
            content_type_for_repr = response._content_type_for_repr
            if 'text/html' not in content_type_for_repr and 'openapi+json' not in content_type_for_repr:
                response.content = response.rendered_content
            response.status_code = 200
        return response

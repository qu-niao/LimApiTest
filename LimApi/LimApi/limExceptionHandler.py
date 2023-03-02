import json

import requests
from django.db import IntegrityError, OperationalError
from django.db.models import ProtectedError
from django.http import Http404
from rest_framework import status, exceptions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import set_rollback


def diy_exception_handler(exc, context):
    """
    Returns the response that should be used for any given exception.

    By default we handle the REST framework `APIException`, and also
    Django's built-in `Http404` and `PermissionDenied` exceptions.

    Any unhandled exceptions may return `None`, which will cause a 500 error
    to be raised.
    """
    print('exception_handler', str(exc), type(exc))
    if isinstance(exc, Http404):
        exc = exceptions.NotFound()
    elif isinstance(exc, PermissionDenied):
        exc = exceptions.PermissionDenied()
    elif isinstance(exc, OperationalError):
        return Response({'msg': '数据库操作报错' + str(exc)}, status=status.HTTP_400_BAD_REQUEST)
    elif isinstance(exc, requests.exceptions.ConnectionError):
        msg = '定时服务连接异常！请联系管理员' if '/scheduler/' in str(exc) else '连接失败!'
        return Response({'msg': msg}, status=status.HTTP_400_BAD_REQUEST)
    elif 'matching query does not exist' in str(exc):
        return Response({'msg': '数据不存在！'}, status=status.HTTP_400_BAD_REQUEST)
    elif '1062' in str(exc):
        return Response({'msg': '该数据已存在！'}, status=status.HTTP_400_BAD_REQUEST)
    elif isinstance(exc, IntegrityError) and '1451' in str(exc):
        return Response({'msg': '该数据还存在子数据无法删除！'}, status=status.HTTP_400_BAD_REQUEST)
    elif isinstance(exc, ProtectedError):
        return Response({'msg': '该数据在其他地方被使用，无法删除！'}, status=status.HTTP_400_BAD_REQUEST)
    if isinstance(exc, exceptions.APIException):
        headers = {}
        if getattr(exc, 'auth_header', None):
            headers['WWW-Authenticate'] = exc.auth_header
        if getattr(exc, 'wait', None):
            headers['Retry-After'] = '%d' % exc.wait
        if isinstance(exc.detail, (list, dict)):
            data = exc.detail
        else:
            data = {'msg': exc.detail}
        set_rollback()
        return Response(data, status=exc.status_code, headers=headers)

    return None


def response_exception_handler(exc, context):
    """
    接口响应结果的异常处理
    """
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = diy_exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response is not None:
        res_data = response.data
        if isinstance(response.data, dict):
            if res_data.get('msg') == '分页无效':
                res_data['code'] = response.status_code = status.HTTP_200_OK
                res_data.update({'total': 0, 'data': []})
            else:
                res_data['code'] = response.status_code
                if not res_data.get('msg'):  # 可能存在报错没有detail的情况
                    if response.status_code == status.HTTP_400_BAD_REQUEST and not res_data.get('msg'):
                        res_data.pop('code', None)
                        res_data['msg'] = json.dumps(res_data, ensure_ascii=False)
        elif isinstance(response.data, (list, tuple)):
            data = response.data
            response.data = {'code': response.code, 'msg': ''.join(data)}
    return response

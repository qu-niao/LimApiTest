from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrNoDeletePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if bool(request.user and request.user.is_authenticated):  # 验证是否登录
            if request.method != 'DELETE':
                return True
            elif request.user.is_staff:
                return True
            return False
        return False

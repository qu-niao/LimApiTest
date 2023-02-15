from rest_framework.authentication import TokenAuthentication

from rest_framework.permissions import SAFE_METHODS

from LimApi.settings import AUTHORIZE_API, NO_AUTHORIZE_API


class LimTokenAuthentication(TokenAuthentication):

    def authenticate(self, request):
        """
        重写验证方法，当请求方法安全且接口不需要验证时,不进行登录判断（即便携带了token也不判断）
        """
        if request.path in NO_AUTHORIZE_API or (request.method in SAFE_METHODS and request.path not in AUTHORIZE_API):
            return None
        return super().authenticate(request)

from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class StandardPageNumberPagination(PageNumberPagination):
    """
      自定义查询，前端可以自定义页码大小
    """
    page_size_query_param = 'page_size'
    max_page_size = 10000  # 最大允许的数量

    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginate a queryset if required, either returning a
        page object, or `None` if pagination is not configured for this view.
        """
        try:
            return super().paginate_queryset(queryset, request, view)
        except NotFound:
            msg = '分页无效'
            raise NotFound(msg)

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('total', self.page.paginator.count),
            ('data', data)
        ]))

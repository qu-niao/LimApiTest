from rest_framework.filters import BaseFilterBackend


class QueryOnlyFields(BaseFilterBackend):
    """
    Filter that only allows users to see their own objects.
    """

    def filter_queryset(self, request, queryset, view):
        data_fields = getattr(view, 'query_only_fields', None)

        if data_fields:
            queryset = queryset.only(*data_fields)
        return queryset


class DiySearchFilter(BaseFilterBackend):
    """
    Filter that only allows users to see their own objects.
    """

    def filter_queryset(self, request, queryset, view):
        """
        自定义模糊匹配查询
        """
        search_fields = getattr(view, 'diy_search_fields', None)
        if search_fields:
            params = request.query_params.dict()
            filter_fields = {}
            # 模糊匹配
            for field in search_fields:
                if field in params:
                    filter_fields[field + '__icontains'] = params[field]
            queryset = queryset.filter(**filter_fields)
        return queryset

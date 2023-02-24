from rest_framework import serializers

from apiData.models import ApiCaseModule, ApiCase, ApiModule, ApiCaseStep, ApiForeachStep
from apiData.viewDef import set_foreach_tree
from comMethod.comSerializers import ComEditUserNameSerializer
from comMethod.constant import API_FOREACH, API


class CaseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiCaseModule
        fields = '__all__'


class ApiModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiModule
        fields = '__all__'


class ApiCaseStepSerializer(serializers.ModelSerializer):
    params = serializers.SerializerMethodField()

    def get_params(self, obj):
        if obj.type == API_FOREACH:
            obj.params['steps'] = set_foreach_tree(
                ApiForeachStep.objects.filter(step_id=obj.id).values().order_by('id'))
        return obj.params

    class Meta:
        model = ApiCaseStep
        exclude = ('case', 'api')


class ApiCaseRelationApiStepSerializer(serializers.ModelSerializer):
    is_relation = serializers.SerializerMethodField()
    params = serializers.SerializerMethodField()

    def get_is_relation(self, obj):
        api_id = int(self.context['api_id'])
        if obj.type == API and obj.api_id == api_id:
            return True
        elif obj.type == API_FOREACH:
            foreach_api_ids = list(ApiForeachStep.objects.filter(step_id=obj.id).values_list('api_id', flat=True))
            if api_id in foreach_api_ids:
                return True
        return False

    def get_params(self, obj):
        if obj.type == API_FOREACH:
            api_id = int(self.context['api_id'])
            foreach_data = list(ApiForeachStep.objects.filter(step_id=obj.id).values().order_by('id'))
            for foreach in foreach_data:
                if foreach['api_id'] == api_id:
                    foreach['is_relation'] = True

            obj.params['steps'] = set_foreach_tree(foreach_data)
        return obj.params

    class Meta:
        model = ApiCaseStep
        exclude = ('case', 'api')


class ApiIsRelatedCaseStepMixin:
    """
        处理使用了该接口的用例步骤查询
     """

    @property
    def fields(self):
        fields = super().fields
        fields['steps'] = ApiCaseRelationApiStepSerializer(
            source='case_step', many=True) if self.context['api_id'] else ApiCaseStepSerializer(
            source='case_step', many=True)
        return fields


class ApiCaseSerializer(ApiIsRelatedCaseStepMixin, serializers.ModelSerializer):
    steps = ApiCaseStepSerializer(source='case_step', many=True)
    module_related = serializers.JSONField(source='module.module_related')
    only_show = serializers.SerializerMethodField()

    def get_only_show(self, obj):
        return obj.creater_id == self.context['user_id']

    class Meta:
        model = ApiCase
        fields = (
            'id', 'name', 'remark', 'steps', 'module_id', 'latest_run_time', 'updated', 'module_related', 'only_show')


class ApiCaseListSerializer(ComEditUserNameSerializer):
    class Meta:
        model = ApiCase
        fields = (
            'id', 'name', 'creater_name', 'latest_run_time', 'updater_name', 'updated', 'created', 'status', 'updater')

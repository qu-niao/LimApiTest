from django.urls import path

from apiData import views

app_name = "apiData"

urlpatterns = [
    path('tree-case-module', views.tree_case_module),
    path('tree-cascader-module-case', views.tree_cascader_module_case),
    path('case-module-view', views.CaseModuleViews.as_view()),
    path('case-view', views.ApiCaseViews.as_view()),
    path('delete-selected-cases', views.delete_selected_cases),
    path('api-view', views.ApiViews.as_view()),
    path('tree-api-module', views.tree_api_module),
    path('api-module-view', views.ApiModuleViews.as_view()),
    path('search-api', views.search_api),
    path('run-api-cases', views.run_api_cases),
    path('run-api-case-step', views.run_api_case_step),
    path('stop-casing', views.stop_casing),
    path('copy-cases', views.copy_cases),
    path('merge-cases', views.merge_cases),
    path('copy-step-to-other-case', views.copy_step_to_other_case),
    path('test-api-data', views.test_api_data),
    path('search-case-by-api', views.search_case_by_api),
    path('api-report', views.get_api_report),
    path('case-sort-list', views.case_sort_list),
    path('set-case-position', views.set_case_position),
    path('clean-deleted-cases', views.clean_deleted_cases),
]

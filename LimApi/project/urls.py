from django.urls import path
from project import views

app_name = "project"

urlpatterns = [
    path('project-view', views.ProjectView.as_view()),
    path('project-overview', views.project_overview),
    path('project-envir-data', views.get_project_envir_data),
    path('project-have-envir', views.get_project_have_envir),
    path('test-db-connect', views.test_db_connect),
    path('proj-db-database', views.get_proj_db_database),
    path('run-sql', views.run_sql),
    path('get-index-statistics', views.get_index_statistics),
]

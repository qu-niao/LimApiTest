from django.urls import path

from conf import views

app_name = "conf"

urlpatterns = [
    path('envir-view', views.EnvirView.as_view()),
    path('param-type', views.get_param_type),
    path('change-envir-position', views.change_envir_position),
]

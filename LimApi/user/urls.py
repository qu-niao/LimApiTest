from django.urls import path
from user import views

app_name = "user"

urlpatterns = [
    path('login', views.login),
    path('user-view', views.UserView.as_view()),
    path('user-cfg-params', views.get_user_cfg_params),
    path('clear-user-temp-params', views.clear_user_temp_params),
    path('set-user-cfg', views.set_user_cfg),
    path('change-password', views.change_password),
]

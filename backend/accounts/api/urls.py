from django.urls import path
from accounts.api.views import CreateUserView, GetCookieTokenView

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('login/', GetCookieTokenView.as_view(), name='cookie_login'),
]
from rest_framework.routers import DefaultRouter
from task.api.views import TaskViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', TaskViewSet, basename="task")

urlpatterns = [
    path('', include(router.urls)),
]
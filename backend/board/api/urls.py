from rest_framework.routers import DefaultRouter
from board.api.views import BoardViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', BoardViewSet, basename="board")

urlpatterns = [
    path('', include(router.urls)),
]
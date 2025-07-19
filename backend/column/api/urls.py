from rest_framework.routers import DefaultRouter
from column.api.views import ColumnViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', ColumnViewSet, basename="column")

urlpatterns = [
    path('', include(router.urls)),
]
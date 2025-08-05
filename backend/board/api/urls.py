from rest_framework.routers import DefaultRouter
from board.api.views import BoardViewSet, UserBoardsViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'boards', BoardViewSet, basename="board")
router.register(r'user-boards', UserBoardsViewSet, basename="user_boards")

urlpatterns = [
    path('', include(router.urls)),
]
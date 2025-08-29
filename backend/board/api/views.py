from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny, SAFE_METHODS, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets

from board.api.serializers import BoardSerializer
from board.models import Board

from rest_framework_simplejwt.authentication import JWTAuthentication


PUBLIC_BOARD_IDS = [1,2,3]

class IsBoardOwnerOrReadOnly(BasePermission):
    """
    only the owner can create/delete the board.
    everyone can read if queryset allows.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user


class BoardViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsBoardOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Board.objects.filter(owner=self.request.user)
        return Board.objects.filter(id__in=PUBLIC_BOARD_IDS)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            raise PermissionDenied
            
class UserBoardsViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]
    queryset = Board.objects.all()
    
    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user.id)
from rest_framework.permissions import IsAuthenticated, AllowAny, SAFE_METHODS
from rest_framework import viewsets

from board.api.serializers import BoardSerializer
from board.models import Board

class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Board.objects.all()
        else:
            return Board.objects.filter(id__in=[1,2,3])

    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)

class UserBoardsViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    permission_classes = [IsAuthenticated]
    queryset = Board.objects.all()
    
    def get_queryset(self):
        return Board.objects.filter(owner_id=self.request.user.id)
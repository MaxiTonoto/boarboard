from column.models import Column
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import PermissionDenied, NotFound
from column.api.serializers import ColumnSerializer
from board.models import Board
from board.api.views import PUBLIC_BOARD_IDS

from rest_framework_simplejwt.authentication import JWTAuthentication

class ColumnViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    serializer_class = ColumnSerializer
    queryset = Column.objects.all()

    def get_queryset(self):
      if not request.user.is_authenticated:
        return Column.objects.filter(board__id__in=PUBLIC_BOARD_IDS)

      return Column.objects.filter(board__owner=self.request.user)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied

        board = get_object_or_404(Board, id=self.request.data.get("board"))

        if board.owner != self.request.user:
            raise PermissionDenied
        serializer.save()

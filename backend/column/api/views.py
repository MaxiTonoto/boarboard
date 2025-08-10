from column.models import Column
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import PermissionDenied, NotFound
from column.api.serializers import ColumnSerializer
from board.models import Board

class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    queryset = Column.objects.all()

    def perform_create(self, serializer):
        board = get_object_or_404(Board, id=self.request.data.get("board"))

        if not board:
            raise NotFound
        elif not self.request.user.is_authenticated:
            raise PermissionDenied

        if board.owner == self.request.user:
            serializer.save()
        else:
            raise PermissionDenied
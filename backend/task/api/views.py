from task.models import Task
from rest_framework import viewsets
from task.api.serializers import TaskSerializer
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from column.models import Column
from board.models import Board
from task.models import Task
from board.api.views import PUBLIC_BOARD_IDS


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # not authenticated users can only query the tasks
        # from public boards
        if not self.request.user.is_authenticated:
          return Task.objects.filter(column__owner__id__in=PUBLIC_BOARD_IDS)
        return Task.objects.filter(column__owner=self.request.user)

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied

        column = get_object_or_404(Column, id=self.request.data.get("column"))

        if column.board.owner != self.request.user:
            raise PermissionDenied
        serializer.save(owner=self.request.user)

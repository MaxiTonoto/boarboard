from task.models import Task
from rest_framework import viewsets
from task.api.serializers import TaskSerializer
from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import permissions
from column.models import Column
from board.models import Board
from task.models import Task

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
          raise PermissionDenied
        column = get_object_or_404(Column, id=self.request.data.get("column"))
        if column.board.owner != user:
            raise PermissionDenied
        serializer.save(owner=self.request.user)
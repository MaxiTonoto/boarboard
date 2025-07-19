from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'tasks': reverse('task-list', request=request, format=format),
        'columns': reverse('column-list', request=request, format=format),
        'boards': reverse('board-list', request=request, format=format),
    })
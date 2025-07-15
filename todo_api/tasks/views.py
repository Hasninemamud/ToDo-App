from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from . import models

class RegisterView(generics.CreateAPIView):
    """
    Register a new user.

    Creates a new user with the provided username and password.
    """
    serializer_class = UserSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    """
    List all tasks or create a new task.

    GET: Returns a list of tasks for the authenticated user, optionally filtered by status or upcoming due dates.
    POST: Creates a new task for the authenticated user.
    Query Parameters:
        - status=true: Filter for completed tasks.
        - status=false: Filter for incomplete tasks.
        - upcoming=true: Filter for tasks due within the next 7 days.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter tasks based on query parameters.
        """
        queryset = Task.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        upcoming = self.request.query_params.get('upcoming')

        if status_param is not None:
            queryset = queryset.filter(status=status_param.lower() == 'true')
        if upcoming == 'true':
            today = timezone.now().date()
            end_date = today + timedelta(days=7)
            queryset = queryset.filter(due_date__gte=today, due_date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        """
        Assign the authenticated user and set order for the new task.
        """
        max_order = Task.objects.filter(user=self.request.user).aggregate(models.Max('order'))['order__max'] or 0
        serializer.save(user=self.request.user, order=max_order + 1)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a task.

    GET: Returns details of a specific task.
    PUT: Updates a specific task.
    DELETE: Deletes a specific task.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restrict to tasks owned by the authenticated user.
        """
        return Task.objects.filter(user=self.request.user)

class TaskOrderView(APIView):
    """
    Update the order of tasks.

    POST: Updates the order of tasks based on the provided list of task IDs and their new order values.
    Body: [{"id": int, "order": int}, ...]
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Handle task order updates.
        """
        try:
            order_data = request.data
            for item in order_data:
                task = Task.objects.get(id=item['id'], user=request.user)
                task.order = item['order']
                task.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from django.db.models import Max


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        status = self.request.query_params.get('status')
        upcoming = self.request.query_params.get('upcoming')

        if status is not None:
            queryset = queryset.filter(status=status.lower() == 'true')
        if upcoming == 'true':
            today = timezone.now().date()
            end_date = today + timedelta(days=7)
            queryset = queryset.filter(due_date__gte=today, due_date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        # Set order to the highest existing order + 1 for new tasks
        max_order = Task.objects.filter(user=self.request.user).aggregate(Max('order'))['order__max'] or 0
        serializer.save(user=self.request.user, order=max_order + 1)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TaskOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Expect an array of {id, order} objects
            order_data = request.data
            for item in order_data:
                task = Task.objects.get(id=item['id'], user=request.user)
                task.order = item['order']
                task.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
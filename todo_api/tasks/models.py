from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.BooleanField(default=False)
    due_date = models.DateField()
    order = models.PositiveIntegerField(default=0)  # New field for ordering

    class Meta:
        ordering = ['order', 'id']  # Order by 'order' field, then 'id'

    def __str__(self):
        return self.title
from django.db import models
from django.contrib.auth.models import User

class Assignment(models.Model):
    STATUS_CHOICES = [
        ('not complete', 'Not Complete'),
        ('in progress', 'In Progress'),
        ('completed', 'Completed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not complete')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

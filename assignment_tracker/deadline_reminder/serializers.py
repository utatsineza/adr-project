from rest_framework import serializers
from deadline_reminder.models import Assignment

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'name', 'deadline', 'status']  # Explicit fields (no recursion risk)

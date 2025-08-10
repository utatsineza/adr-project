from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from ..deadline_reminder.models import Assignment

def send_assignment_reminders():
    now = timezone.now().date()
    upcoming_assignments = Assignment.objects.filter(
        deadline__gte=now,
        deadline__lte=now + timezone.timedelta(days=5)
    )

    for assignment in upcoming_assignments:
        days_left = (assignment.deadline - now).days
        if days_left in [5, 3, 1]:
            subject = f"Reminder: {assignment.name} due in {days_left} days"
            message = (
                f"Hello {assignment.user.username},\n\n"
                f"Your assignment '{assignment.name}' is due on {assignment.deadline}.\n"
                f"Please complete it before the deadline."
            )
            recipient = assignment.user.email
            if recipient:  # Avoid sending if email is empty
                send_mail(subject, message, settings.EMAIL_HOST_USER, [recipient])

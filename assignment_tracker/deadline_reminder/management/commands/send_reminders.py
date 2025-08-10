from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from deadline_reminder.models import Assignment  # adjust if your model is elsewhere

class Command(BaseCommand):
    help = "Send daily notification emails 5 days before and until the assignment due date"

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        
        # Find all assignments with deadlines within the next 5 days (including today)
        assignments = Assignment.objects.filter(deadline__range=[today, today + timezone.timedelta(days=5)])

        for assignment in assignments:
            user = assignment.user  # assumes Assignment model has a ForeignKey to User

            days_remaining = (assignment.deadline - today).days

            send_mail(
                subject='Assignment Due Reminder',
                message=(
                    f"Hi {user.username},\n\n"
                    f"Your assignment \"{assignment.name}\" is due in {days_remaining} day(s) "
                    f"(on {assignment.deadline}).\n\n"
                    "Please make sure to submit it on time!"
                ),
                from_email='your_email@example.com',
                recipient_list=[user.email],
                fail_silently=False,
            )

        self.stdout.write(self.style.SUCCESS("Notifications sent successfully."))

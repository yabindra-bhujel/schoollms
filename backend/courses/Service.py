from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Assignment

@receiver(post_save, sender=Assignment)
def update_assignment_status(sender, instance, **kwargs):
    now = timezone.now()
    if instance.assignment_start_date <= now:
        instance.is_actived = True
        instance.save(update_fields=['is_actived'])
    else:
        instance.is_actived = False
        instance.save(update_fields=['is_actived'])

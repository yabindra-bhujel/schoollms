from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from courses.subjects.models import Subject, SubjectRegistration, Assignment
import logging
from django.core.mail import send_mail
from django.conf import settings
logger = logging.getLogger(__name__)
from django.contrib.auth import get_user_model
User = get_user_model()


@shared_task
def update_assignment_status():
    try:
        now = timezone.now()
        active_assignments = Assignment.objects.filter(start_date__lte=now, deadline__gt=now)
        expired_assignments = Assignment.objects.filter(deadline__lte=now)
        active_assignments.update(is_active=True)
        expired_assignments.update(is_active=False)

        logger.info(f"Updated {active_assignments.count()} assignments as active.")
        logger.info(f"Updated {expired_assignments.count()} assignments as expired.")
    except Exception as e:
        logger.error(f"An error occurred while updating assignment statuses: {e}")



@shared_task
def send_reminder_email():
    try:
        now = timezone.now()
        active_assignments = Assignment.objects.filter(
            start_date__lte=now, 
            deadline__gt=now,
            reminder_email_sent=False,
            )
        
        for assignment in active_assignments:
            time_remaining = assignment.deadline - now
            if time_remaining <= timedelta(hours=3):
                for student in assignment.students.all():
                    send_mail(
                        subject='リマインダー: 期限間近の課題',
                        message=f'{student.first_name} {student.last_name} さんへ\n\nこのメールは、次の課題 "{assignment.title}" の提出期限が迫っていることをお知らせするものです。次の3時間以内に提出をお願いします。\n\n四国大学',
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[student.email],
                        fail_silently=False,
                    )
                    logger.info(f"Reminder email sent to {student.email} for assignment: {assignment.title}")
                assignment.reminder_email_sent = True
                assignment.save()
    except Exception as e:
        logger.error(f"An error occurred while sending reminder emails: {e}")



@shared_task
def send_passed_deadline_email():
    try:
        now = timezone.now()
        expired_assignments = Assignment.objects.filter(
            deadline__lte=now,
            deadline_email_sent=False,
        )
        
        for assignment in expired_assignments:
            subject_enroll = SubjectRegistration.objects.filter(subject=assignment.course).first()
            if subject_enroll:
                teacher_email = subject_enroll.teacher.email
                
                send_mail(
                    subject='期限切れの課題',
                    message=f' "{assignment.assignment_title}" の提出期限が切れました。\n\n 合計{assignment.submission_count} 人の学生が提出しました。詳しくは {settings.FRONTEND_URL} で確認お願いします。 \n\n四国大学',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[teacher_email],
                    fail_silently=False,
                )

                
                assignment.deadline_email_sent = True
                assignment.save()
                
                logger.info(f"Passed deadline email sent to teacher {teacher_email} for assignment: {assignment.assignment_title}")
    except Exception as e:
        logger.error(f"An error occurred while sending passed deadline emails: {e}")

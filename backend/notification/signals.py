# # from django.db.models.signals import post_save
# # from django.dispatch import receiver
# # from .models import AssignmentNotificationModel
# # from courses.models import Assignment

# # @receiver(post_save, sender=Assignment)
# # def assignment_post_save(sender, instance, created, **kwargs):
# #     print(f"Signal triggered for Assignment: {instance.assignment_title}")
# #     if created:
# #         try:
# #             print("Creating AssignmentNotificationModel...")
# #             notification = AssignmentNotificationModel.objects.create(
# #                 assignment=instance,
# #                 title='New Assignment',
# #                 content=f'New assignment "{instance.assignment_title}" has been created.',
# #                 is_read=False
# #             )
# #             # Add students (users) to the notification
# #             for student in instance.student.all():
# #                 print(f"Adding {student} to notification...")
# #                 notification.user.add(student)

# #         except Exception as e:
# #             print(f"Error creating AssignmentNotificationModel: {e}")


# from django.db.models.signals import m2m_changed
# from django.dispatch import receiver
# from .models import AssignmentNotificationModel
# from courses.models import Assignment
# from student.models import Student
# from django.contrib.auth import get_user_model
# User = get_user_model()

# @receiver(m2m_changed, sender=Assignment.student.through)
# def assignment_student_changed(sender, instance, action, **kwargs):
#     if action == 'post_add' and isinstance(instance, Assignment):
#         try:
#             print("Creating AssignmentNotificationModel...")
#             notification = AssignmentNotificationModel.objects.create(
#                 assignment=instance,
#                 title='New Assignment',
#                 content=f'New assignment "{instance.assignment_title}" has been created.',
#                 is_read=False
#             )

#             for student_id in instance.student.values_list('studentID', flat=True):
#                 # Check if the user with the given ID exists before adding it to the notification
#                 if User.objects.filter(id=student_id).exists():
#                     notification.user.add(student_id)
#                     print(f"Added student ID {student_id} to notification")
#                 else:
#                     print(f"User with ID {student_id} does not exist.")
#         except Exception as e:
#             print(f"Error creating AssignmentNotificationModel: {e}")

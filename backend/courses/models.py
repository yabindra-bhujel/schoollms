from datetime import date
from django.db import models
from django.utils import timezone
from django.utils import timezone
from student.models import Student
from teacher.models import Teacher
from university import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.deconstruct import deconstructible
from django.db import transaction
import random


class Department(models.Model):
    Department_name = models.CharField(max_length=50, null=True, unique=True)
    Department_code = models.CharField(max_length=50, null=True, unique=True)

    def __str__(self):
        return self.Department_name
    
    
class Subject(models.Model):
    CLASS_ROOM_CODE = (
        ('U101', 'U101'),
        ('U202', 'U202'),
        ('U104', 'U104'),
        ('U506', 'U506')

    )
    PERIOD_START_TIME = (
        ('9:00', '9:00'), 
        ('10:40', '10:40'), 
        ('13:00', '13:00'), 
        ('14:40', '14:40'), 
    )
    PERIOD_End_TIME = (
        ('10:30', '10:30'),
        ('12:10', '12:10'),
        ('14:30', '14:30'),
        ('16:10', '16:10'),
    )
    CLASS_PERIOD=(
                ('1', '1'),
                ('2', '2'),
                ('3', '3'),
                ('4', '4'),
                ('5', '5'),
                ('6', '6'),
            )
    

    DAYS_OF_WEEK = (
    ('Monday', 'Monday'),
    ('Tuesday', 'Tuesday'),
    ('Wednesday', 'Wednesday'),
    ('Thursday', 'Thursday'),
    ('Friday', 'Friday'),
    ('Saturday', 'Saturday'),
)
    subject_name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    subject_code = models.CharField(max_length=255, null=False, blank=False, unique=True)
    subject_description = models.TextField(null=False, blank=False)
    weekday = models.CharField(max_length=20, choices=DAYS_OF_WEEK)
    period_start_time = models.CharField(max_length=20, choices=PERIOD_START_TIME)
    period_end_time = models.CharField(max_length=20, choices=PERIOD_End_TIME)
    class_room = models.CharField(max_length=20, choices=CLASS_ROOM_CODE)
    class_period = models.CharField(max_length=2, choices=CLASS_PERIOD, default='1')
    subject_teacher = models.ForeignKey('teacher.Teacher', on_delete=models.PROTECT, null=True)
    subject_faculty = models.ForeignKey(Department, on_delete=models.PROTECT, null=True)


    def __str__(self):
        return self.subject_name
    

class SubjectEnroll(models.Model):
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    student = models.ManyToManyField('student.Student')
    teacher = models.ForeignKey('teacher.Teacher', on_delete=models.CASCADE)
    

    def __str__(self):
        return self.course.subject_name + " " + self.teacher.first_name + " " + self.teacher.last_name




class TextAssigemntQuestion(models.Model):
    question = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.question

class Assignment(models.Model):
    ASSIGNMENT_TYPE = (
    ('File', 'File'),
    ('Text', 'Text'),
    )

    student = models.ManyToManyField(Student, related_name='assignments', blank=True)
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    assignment_title = models.CharField(max_length=255, null=False, blank=False)
    assignment_description = models.TextField(null=False, blank=False)
    text_question = models.ManyToManyField(TextAssigemntQuestion, blank=True)
    assignment_deadline = models.DateTimeField()
    assignment_posted_date = models.DateTimeField(default=timezone.now)
    assignment_type = models.CharField(max_length=20, choices=ASSIGNMENT_TYPE, default='File')
    is_active = models.BooleanField(null=True, blank=True, default=True)
    submission_count = models.PositiveIntegerField(default=0)
    additional_info = models.TextField(null=True, blank=True)
    last_modified = models.DateTimeField(auto_now=True)
    max_grade = models.PositiveIntegerField(default=100)
    assignment_start_date = models.DateTimeField(default=timezone.now)
    assignment_duration = models.DurationField(null=True, blank=True)
    is_published = models.BooleanField(default=True)

    @property
    def is_active(self):
        now = timezone.now()
        if self.assignment_deadline <= now:
            return False
        elif self.assignment_start_date > now:
            return False
        else:
            return True
        


    def has_student_submitted(self, student):
        # Check for file submission
        if self.file_submissions.filter(student=student).exists():
            return True

        # Check for text submission
        if self.text_submissions.filter(student=student).exists():
            return True

        return False
    


    def __str__(self):
        return self.assignment_title
    






class AssignmentFile(models.Model):
    file = models.FileField(upload_to='file_submission')

    def __str__(self):
        return self.file.name

    
class FileSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='file_submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assignment_submission_file = models.ManyToManyField(AssignmentFile, related_name='assignments')
    submission_datetime = models.DateTimeField(auto_now_add=True)
    is_submited = models.BooleanField(default=False)
    is_graded = models.BooleanField(default=False)
    grade = models.PositiveIntegerField(default=0)


    def __str__(self):
        return self.assignment.assignment_title
    
class TextAnswer(models.Model):
    question = models.ForeignKey(TextAssigemntQuestion, on_delete=models.CASCADE)
    answer = models.TextField(null=True, blank=True)




class TextSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='text_submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    submission_time = models.DateTimeField(auto_now_add=True)
    is_submited = models.BooleanField(default=False)
    answer = models.ManyToManyField(TextAnswer)
    student_asnwer_file = models.FileField(upload_to='student_asnwer_file', null=True, blank=True)
    is_graded = models.BooleanField(default=False)
    grade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.assignment.assignment_title




@deconstructible
class UploadToPathAndRename:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        today = date.today()
        filename = f"{today.strftime('%Y%m%d')}_{filename}"
        return f"{self.sub_path}/{filename}"
    

class CourseMateriales(models.Model):
        pdf_file = models.FileField(upload_to=UploadToPathAndRename("Materiales"))
        course = models.ForeignKey(Subject, on_delete=models.CASCADE)

        def __str__(self):
            return self.pdf_file.name
        








class StudentAttended(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    is_present = models.BooleanField(default=False)
    attendance_code = models.CharField(max_length=10, null=True, blank=True)
    attendance = models.ForeignKey('Attendance', on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return self.student.first_name + " " + self.student.last_name + " " + str(self.is_present)



class Attendance(models.Model):
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    subject_enroll = models.ForeignKey(SubjectEnroll, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    attendance_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    students_attended = models.ManyToManyField(StudentAttended, related_name='attendances')
    is_active = models.BooleanField(default=True)



    def save(self, *args, **kwargs):
        if not self.attendance_code:
            self.attendance_code = self.generate_attendance_code()

        if not self.pk:
            super().save(*args, **kwargs)
            students_in_subject_enroll = self.subject_enroll.student.all()
            for student in students_in_subject_enroll:
                student_attended, created = StudentAttended.objects.get_or_create(
                    student=student,
                    is_present=False,
                    attendance_code=self.attendance_code,
                    attendance=self

                )
                self.students_attended.add(student_attended)



    def generate_attendance_code(self):
        return str(random.randint(100000, 999999))


    def __str__(self):
        return self.course.subject_name + " " + str(self.date)
    






class AnnouncementFile(models.Model):
    file = models.FileField(upload_to='announcement_file')

    def __str__(self):
        return self.file.name

class Announcement(models.Model):
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    announcement_title = models.CharField(max_length=255, null=False, blank=False)
    announcement_description = models.TextField(null=False, blank=False)
    announcement_date = models.DateTimeField(auto_now_add=True)
    announcement_last_modified = models.DateTimeField(auto_now=True)
    announcement_file_url = models.ManyToManyField(AnnouncementFile, related_name='announcements', blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.announcement_title
    


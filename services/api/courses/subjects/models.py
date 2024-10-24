from django.db import models
from django.core.validators import RegexValidator
from courses.models import Department
from django.utils import timezone
from datetime import date
from students.models import Student
from django.utils.deconstruct import deconstructible
from django.conf import settings


class Subject(models.Model):
    DAYS_OF_WEEK = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday')
    )
    CLASS_ROOM_CODE = (
        ('U101', 'U101'),
        ('U202', 'U202'),
        ('U104', 'U104'),
        ('U506', 'U506')
    )
    CLASS_PERIOD = (
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4'),
        ('5', '5'),
        ('6', '6')
    )

    subject_name = models.CharField(max_length=255, unique=True, null=False, blank=False, help_text="Name of the subject")
    subject_code = models.CharField(max_length=255, unique=True, null=False, blank=False,  help_text="Code of the subject (e.g., SUB001)")
    subject_description = models.TextField(null=True, blank=True, help_text="Description of the subject")
    weekday = models.CharField(max_length=20, choices=DAYS_OF_WEEK, help_text="Day of the week when the subject is scheduled")
    period_start_time = models.TimeField(help_text="Start time of the subject")
    period_end_time = models.TimeField(help_text="End time of the subject")
    class_room = models.CharField(max_length=20, choices=CLASS_ROOM_CODE, default='U101', help_text="Classroom where the subject is conducted")
    class_period = models.CharField(max_length=2, choices=CLASS_PERIOD, default='1', help_text="Period number of the subject")
    subject_faculty = models.ForeignKey(Department, on_delete=models.PROTECT, null=True, help_text="Faculty offering the subject")

    def __str__(self):
        return self.subject_name
    
    class Meta:
        ordering = ['subject_name']
        verbose_name = "Subject"
        verbose_name_plural = "Subjects"

class SubjectRegistration(models.Model):
    """
    Represents the registration of students for subjects.
    """
    student = models.ManyToManyField('students.Student', help_text="Student registering for the subject")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, help_text="Subject being registered by the student")
    registration_date = models.DateField(auto_now_add=True, help_text="Date when the student registered for the subject")
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, null=True, blank=True, help_text="Teacher assigned to the subject")

    def __str__(self):
        return f"{self.student} - {self.subject}"
    
    class Meta:
        ordering = ['registration_date']
        verbose_name = "Subject Registration"
        verbose_name_plural = "Subject Registrations"


class TextAssigemntQuestion(models.Model):
    """
    Represents a text assignment question.
    """
    question = models.TextField(help_text="Question for the assignment")

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = "Text Assignment Question"
        verbose_name_plural = "Text Assignment Questions"


class Assignment(models.Model):
    class AssignmentType(models.TextChoices):
        TEXT = 'Text', 'Text'
        FILE = 'File', 'File'

    # General Information
    title = models.CharField(max_length=255, verbose_name='Title')
    description = models.TextField(verbose_name='Description')
    course = models.ForeignKey('Subject', on_delete=models.CASCADE, verbose_name='Course')

    # Assignment Type
    assigment_type = models.CharField(max_length=10, choices=AssignmentType.choices, default=AssignmentType.FILE, verbose_name='Type')

    # Additional Information
    additional_info = models.TextField(null=True, blank=True, verbose_name='Additional Information')

    # Dates
    posted_date = models.DateTimeField(default=timezone.now, verbose_name='Posted Date')
    start_date = models.DateTimeField(default=timezone.now, verbose_name='Start Date')
    deadline = models.DateTimeField(verbose_name='Deadline')
    last_modified = models.DateTimeField(auto_now=True, verbose_name='Last Modified')

    # test assignment questions
    questions = models.ManyToManyField(TextAssigemntQuestion, related_name='assignments', blank=True, verbose_name='Questions')

    # Assignment Control
    is_active = models.BooleanField(default=True, verbose_name='Active')
    is_published = models.BooleanField(default=True, verbose_name='Published')
    is_visible = models.BooleanField(default=True, verbose_name='Visible')

    # Student & Submission Information
    students = models.ManyToManyField(Student, related_name='assigned_assignments', blank=True, verbose_name='Students')
    submission_count = models.PositiveIntegerField(default=0, verbose_name='Submission Count')
    max_grade = models.PositiveIntegerField(default=100, verbose_name='Max Grade')

    # Assignment Duration
    duration = models.DurationField(null=True, blank=True, verbose_name='Duration')

    # Notification Flags
    reminder_email_sent = models.BooleanField(default=False, verbose_name='Reminder Email Sent')
    deadline_email_sent = models.BooleanField(default=False, verbose_name='Deadline Email Sent')
    create_notification_start = models.BooleanField(default=False, verbose_name='Create Notification Start')
    create_notification_end = models.BooleanField(default=False, verbose_name='Create Notification End')

    def has_student_submitted(self, student):
        if self.file_submissions.filter(student=student).exists():
            return True
        if self.text_submissions.filter(student=student).exists():
            return True
        return False
    
    def __str__(self):
        return self.title
    

def get_assignment_file_path(instance):
    """
    Returns the file path for the assignment .
    """
    return f'assignments/{instance.assignment.title}/'


class AssignmentFile(models.Model):
    file = models.FileField(verbose_name='File', max_length=255)

    def __str__(self):
        return self.file.name
    
    def get_filepath(self):
        base_url = settings.MEDIA_URL

        return f"{base_url}{self.file.name}"
    
    class Meta:
        verbose_name = "Assignment File"
        verbose_name_plural = "Assignment Files"

class FileSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='file_submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assignment_submission_file = models.ManyToManyField(AssignmentFile, related_name='assignments')
    submission_datetime = models.DateTimeField(auto_now_add=True)
    is_submited = models.BooleanField(default=False)
    is_graded = models.BooleanField(default=False)
    grade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.assignment.title
    
    class Meta:
        verbose_name = "File Submission"
        verbose_name_plural = "File Submissions"


class TextQuestionAnswer(models.Model):
    question = models.ForeignKey(TextAssigemntQuestion, on_delete=models.CASCADE, verbose_name='Question')
    answer = models.TextField(null=True, blank=True, verbose_name='Answer')

    def __str__(self):
        return f"{self.question}: {self.answer}"
    
    class Meta:
        verbose_name = "Text Question Answer"
        verbose_name_plural = "Text Question Answers"

class TextSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='text_submissions', verbose_name='Assignment')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name='Student')
    submission_time = models.DateTimeField(auto_now_add=True, verbose_name='Submission Time')
    is_submitted = models.BooleanField(default=False, verbose_name='Is Submitted')
    answers = models.ManyToManyField(TextQuestionAnswer, verbose_name='Answers')
    student_answer_file = models.FileField(null=True, blank=True, verbose_name='Student Answer File')
    is_graded = models.BooleanField(default=False, verbose_name='Is Graded')
    grade = models.PositiveIntegerField(default=0, verbose_name='Grade')

    def __str__(self):
        return f"Submission for {self.assignment.title} by {self.student}"
    
    class Meta:
        verbose_name = "Text Submission"
        verbose_name_plural = "Text Submissions"

@deconstructible
class UploadToPathAndRename:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        today = date.today()
        filename = f"{today.strftime('%Y%m%d')}_{filename}"
        return f"{self.sub_path}/{filename}"
    
class CourseMateriales(models.Model):
    pdf_file = models.FileField(upload_to=UploadToPathAndRename("course_materials"))
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return self.pdf_file.name
    
    class Meta:
        verbose_name = "Course Material"
        verbose_name_plural = "Course Materials"

class AnnouncementFile(models.Model):
    file = models.FileField(upload_to='announcement_file')

    def __str__(self):
        return self.file.name
    
    class Meta:
        verbose_name = "Announcement File"
        verbose_name_plural = "Announcement Files"


class Announcement(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    announcement_title = models.CharField(max_length=255, null=False, blank=False)
    announcement_description = models.TextField(null=False, blank=False)
    announcement_date = models.DateTimeField(auto_now_add=True)
    announcement_last_modified = models.DateTimeField(auto_now=True)
    announcement_file_url = models.ManyToManyField(AnnouncementFile, related_name='announcements', blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.announcement_title
    
    class Meta:
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"


class SyllabusItem(models.Model):
    section_title = models.CharField(max_length=255, null=False, blank=False)
    section_description = models.TextField(null=False, blank=False)

    def __str__(self):
        return self.section_title
    
    class Meta:
        verbose_name = "Syllabus Item"
        verbose_name_plural = "Syllabus Items"

class Syllabus(models.Model):
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    syllabus_items = models.ManyToManyField(SyllabusItem, related_name='syllabuses', blank=True)

    def __str__(self):
        return f"Syllabus for {self.course}"
    
    class Meta:
        verbose_name = "Syllabus"
        verbose_name_plural = "Syllabuses"
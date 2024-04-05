import random
from django.db import models
from ..subjects.models import Subject, SubjectRegistration
from students.models import Student

class StudentAttended(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    is_present = models.BooleanField(default=False)
    attendance_code = models.CharField(max_length=10, null=True, blank=True)
    attendance = models.ForeignKey('Attendance', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.student.first_name} {self.student.last_name} {self.is_present}"

class Attendance(models.Model):
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    subject_enroll = models.ForeignKey(SubjectRegistration, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    attendance_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    students_attended = models.ManyToManyField(StudentAttended, related_name='attendances')
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.attendance_code:
            self.attendance_code = self.generate_attendance_code()
        super().save(*args, **kwargs)
        self.create_student_attendance_records()

    def generate_attendance_code(self):
        return str(random.randint(100000, 999999))

    def create_student_attendance_records(self):
        students_in_subject_enroll = self.subject_enroll.student.all()
        for student in students_in_subject_enroll:
            student_attended, _ = StudentAttended.objects.get_or_create(
                student=student,
                is_present=False,
                attendance_code=self.attendance_code,
                attendance=self
            )
            self.students_attended.add(student_attended)

    def __str__(self):
        return f"{self.course.subject_name} {self.date}"

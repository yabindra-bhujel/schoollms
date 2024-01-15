from rest_framework import serializers

from student.models import Student
from teacher.serializers import TeacherSerializer
from .models import  *
from university import settings

from django.urls import reverse
from django.conf import settings
from urllib.parse import urljoin


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

        
class AnnouncementFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = AnnouncementFile
        fields = ['id', 'file_url']

    def get_file_url(self, obj):
        if obj.file:
            return self.context['request'].build_absolute_uri(obj.file.url)
        return None
    

class AnnouncementSerializer(serializers.ModelSerializer):
    announcement_file_url = AnnouncementFileSerializer(many=True, read_only=True)

    class Meta:
        model = Announcement
        fields = '__all__'

        

class StudentAttendedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttended
        fields = '__all__'
        

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class CourseMaterialesSerializers(serializers.ModelSerializer):
    class Meta:
        model = CourseMateriales
        fields = '__all__'

   
        
class DepartmentSerializers(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        # fields = ['subject_code', 'subject_name', 'subject_description', 'weekday', 'period_start_time', 'period_end_time', 'class_room', 'class_period']

class SubjectEnrollSerializers(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()

    class Meta:
        model = SubjectEnroll
        fields = ['id', 'course', 'teacher', 'student']

    def get_student(self, obj):
        return [{'Student_id': student.studentID, 'name': student.first_name} for student in obj.student.all()]

    def get_teacher(self, obj):
        return {'Teacher_id': obj.teacher.id, 'name': obj.teacher.first_name}
    
    def get_course(self, obj):
        return SubjectSerializer(obj.course).data






class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        exclude = ['text_question']







class AssignmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentFile
        fields = ('file',)

class FileSubmissionSerializer(serializers.ModelSerializer):
    assignment_submission_file = AssignmentFileSerializer(many=True, read_only=True)

    class Meta:
        model = FileSubmission
        fields = ( 'id', 'student', 'submission_datetime', 'is_submited', 'assignment_submission_file', 'is_graded', 'grade' )



class TextSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextSubmission
        fields = '__all__'



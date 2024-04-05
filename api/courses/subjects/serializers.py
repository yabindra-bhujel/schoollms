from rest_framework import serializers
from .models import *



class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class SubjectRegistrationSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()

    class Meta:
        model = SubjectRegistration
        fields = ['student', 'subject', 'registration_date', 'teacher', 'students'] 

    def get_subject(self, obj):
        return SubjectSerializer(obj.subject).data
    
    def get_students(self, obj):
        return [{'student_id': student.student_id, 'name': student.first_name} for student in obj.student.all()]
    
    def get_teacher(self, obj):
        return {'teacher_id': obj.teacher.id, 'name': obj.teacher.first_name}


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'



class CourseMaterialesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMateriales
        fields = '__all__'


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class SyllabusItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyllabusItem
        fields = '__all__'

class SyllabusSerializer(serializers.ModelSerializer):
    syllabus_items = SyllabusItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Syllabus
        fields = '__all__'
        
class AssignmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentFile
        fields = ('file',)

class FileSubmissionSerializer(serializers.ModelSerializer):
    assignment_submission_file = AssignmentFileSerializer(many=True, read_only=True)

    class Meta:
        model = FileSubmission
        fields = ( 'id', 'student', 'submission_datetime', 'is_submited', 'assignment_submission_file', 'is_graded', 'grade' )


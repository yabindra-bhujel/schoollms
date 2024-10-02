from rest_framework import serializers
from .models import *
from .attendance.models import *

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class StudentAttendedSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAttended
        fields = '__all__'
        

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
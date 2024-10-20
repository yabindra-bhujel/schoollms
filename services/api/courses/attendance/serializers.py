from .models import *
from rest_framework import serializers


class StudentAttendanceSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = StudentAttended
        fields = ["student_id", "full_name", "is_present"]

    def get_full_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"


class AttendanceSerializer(serializers.ModelSerializer):
    students_attended = StudentAttendanceSerializer(many=True)

    class Meta:
        model = Attendance
        fields = "__all__"

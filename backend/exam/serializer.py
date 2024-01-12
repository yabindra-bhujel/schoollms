from rest_framework import serializers
from .models import *

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'



class ShortAnswerQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortAnswerQuestion
        fields = '__all__'


class LongAnswerQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongAnswerQuestion
        fields = '__all__'


        
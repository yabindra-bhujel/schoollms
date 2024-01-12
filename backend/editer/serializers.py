from rest_framework import serializers
from.models import CodeProblem

class CodeProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeProblem
        fields = "__all__"
        
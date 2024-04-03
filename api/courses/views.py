from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
User = get_user_model()
from rest_framework import viewsets
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from .serializers import *

class DepartmentViewsSet(viewsets.ViewSet):
    serializer_class = DepartmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    @extend_schema(responses={200: DepartmentSerializer})
    def list(self, request):
        queryset = Department.objects.all()
        serializer = DepartmentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(responses={200: DepartmentSerializer})
    def retrieve(self, request, pk=None):
        queryset = Department.objects.all()
        department = get_object_or_404(queryset, pk=pk)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)
    
    @extend_schema(responses={201: DepartmentSerializer})
    def create(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(responses={200: DepartmentSerializer})
    def update(self, request, pk=None):
        queryset = Department.objects.all()
        department = get_object_or_404(queryset, pk=pk)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(responses={204: None})
    def destroy(self, request, pk=None):
        queryset = Department.objects.all()
        department = get_object_or_404(queryset, pk=pk)
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# views.py
from django.shortcuts import get_object_or_404
from .models import Department
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.openapi import OpenApiTypes
from .serializers import DepartmentSerializer
from typing import Optional, Any
from rest_framework.request import Request
from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)
User = get_user_model()


@extend_schema(tags=["Department"])
class DepartmentViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing Department instances.
    """

    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = "id" 

    def list(self, request: Request) -> Response:
        """
        List all departments.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the department",
            )
        ],
        responses={200: DepartmentSerializer},
    )
    def retrieve(self, request: Request, id: Optional[int] = None) -> Response:
        """
        Retrieve a specific department by ID.
        """
        department = get_object_or_404(self.get_queryset(), id=id)
        serializer = self.get_serializer(department)
        return Response(serializer.data)

    @extend_schema(responses={201: DepartmentSerializer})
    def create(self, request: Request) -> Response:
        """
        Create a new department.
        """
        department_code = request.data.get("department_code")
        department_name = request.data.get("department_name")

        if Department.objects.filter(department_code=department_code).exists():
            return Response(
                {"error": "Department code already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Department.objects.filter(department_name=department_name).exists():
            return Response(
                {"error": "Department name already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the department",
            )
        ],
        responses={200: DepartmentSerializer},
    )
    def update(self, request: Request, id: Optional[int] = None) -> Response:
        """
        Update an existing department by ID.
        """
        department = get_object_or_404(self.get_queryset(), id=id)
        department_name = request.data.get("department_name")
        department_code = request.data.get("department_code")

        if (
            Department.objects.filter(department_name=department_name)
            .exclude(id=id)
            .exists()
        ):
            return Response(
                {"error": "Department name already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if (
            Department.objects.filter(department_code=department_code)
            .exclude(id=id)
            .exists()
        ):
            return Response(
                {"error": "Department code already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(department, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID of the department",
            )
        ],
        responses={204: None},
    )
    def destroy(self, request: Request, id: Optional[int] = None) -> Response:
        """
        Delete a department by ID.
        """
        department = get_object_or_404(self.get_queryset(), id=id)
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

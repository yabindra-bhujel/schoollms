# tenant/middleware.py
from django.db import connection
from tenant.models import User

class CustomTenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        schema_name = connection.schema_name
        if schema_name == 'tenant':
            connection.set_tenant(User)
        else:
            connection.set_tenant(None)
        return self.get_response(request)


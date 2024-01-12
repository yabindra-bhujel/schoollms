from django.contrib import admin

# Register your models here.

from.models import *

admin.site.register(Message)

admin.site.register(FriendRequest)
admin.site.register(Group)
admin.site.register(GroupMessage)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(ImageStore)
admin.site.register(VideoStore)



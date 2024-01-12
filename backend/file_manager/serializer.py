from rest_framework import serializers
from .models import Folder, FileUpload, File


    

class FolderSerializer(serializers.ModelSerializer):
    total_file_count = serializers.IntegerField(read_only=True)
    total_file_size = serializers.IntegerField(read_only=True)
    formatted_size = serializers.SerializerMethodField()
    

    class Meta:
        model = Folder
        fields = '__all__'

    def get_formatted_size(self, obj):
        return obj.formatted_size()



class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = '__all__'



class FileSerializer(serializers.ModelSerializer):
    file = FileUploadSerializer(many=True, read_only=True)

    class Meta:
        model = File
        fields = '__all__'



    def get_date_created(self, obj):
        # Format the datetime to display only the date
        return obj.date_created.strftime('%Y-%m-%d')

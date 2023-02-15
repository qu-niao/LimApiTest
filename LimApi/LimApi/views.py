import os
import time

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from LimApi.settings import FILE_DIR_HOST


@api_view(['POST'])
def put_file(request):
    """
    上传文件
    """

    my_file = request.FILES.get('file')
    appoint_dir = request.data.get('path', '')  # appoint_dir=/XXXX
    timestamp_str = '' if request.data.get('no_timestamp') else str(round(time.time() * 1000))
    file_dir_path = 'FileData' + appoint_dir
    file_name, file_type = os.path.splitext(my_file.name)
    file_name = file_name + timestamp_str + file_type
    file_path = file_dir_path + '/' + file_name
    if os.path.exists(file_dir_path) is not True:  # 如果存放上传文件的文件夹不存在则创建
        os.makedirs(file_dir_path)
    with open(file_path, 'wb+') as f:
        for chunk in my_file.chunks():
            f.write(chunk)
    f.close()
    file_url = (FILE_DIR_HOST + appoint_dir[1:] + '/' + file_name) if appoint_dir else (FILE_DIR_HOST + file_name)
    return Response(data={'file_url': file_url, 'file_name': file_name})

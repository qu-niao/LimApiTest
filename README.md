

# Lim接口测试平台

### 介绍
Lim是Less is More（少即是多）的缩写，如它的名字一样我们希望用户在开展接口测试时所需的操作更少，但建设效率更高、实现的功能更多。因此我们做了许多交互细节上的优化和创新以及一些大胆的设计，比如：取消了局部变量、前后置计划、抛弃“先接口后用例”的传统建设思想，甚至还取消了“登录”！
你是否会疑问：这群Diao毛去掉了这些还如何高效的开展接口测试？
那还在等什么？赶快进入Lim的世界，体验简单又高效的接口测试吧！
#### 在线体验：[http://121.43.43.59/](http://121.43.43.59/) 
#### 功能特点：
1.全局参数管理
(https://img-blog.csdnimg.cn/88ee9190fc93424983c9c68272ab8b11.jpeg)
2.更优雅的接口管理
1. 弹窗拖拽
2. 多环境管理
3. 支持Python代码
#### 三分钟快速上手教程：[点我访问](https://thzfhzdqvc.feishu.cn/docx/FgCpdAEy2oDjP4xJOkFcIjyJnnf)
#### 答疑、定制化开发+微信：qu-niao
### docker镜像
制作中...
### 开发环境搭建教程
#### 前端环境
1.  安装nodejs
2.  安装yarn
3.  进入项目中的lim-web目录执行：`yarn&&yarn start`

---
#### 后端环境
1.  python3.9+;
2.  mysql5.7+;
3. 执行项目中的`init-db.sql`初始化数据库：
4.  进入LimApi目录执行依赖包安装命令：`pip install -r requirement.txt -i https://mirrors.aliyun.com/pypi/simple`;
5. 修改`LimApi/LimApi/settings.py`文件的`DATABASES`数据库配置；
6. 启动服务：`python manage.py runserver 0.0.0.0:8001`;
7. （可选）如果不涉及文件上传的操作可不执行：新开cmd窗口进入FileData目录执行命令`python3 -m http.server 8003`;

**注意：因为django默认启动为单线程模式，所以上述的部署方式无法进行并发操作（例：在用例执行的同时进行中断执行的操作）所以可以通过UWSGI来启动项目。对于Linux系统推荐`gunicorn`+`gevent`的方式部署，本项目中的`requirement.txt`已集成了这两个库，所以在linux服务器上将启动命令更换为：`python3 -m gunicorn -w 5 -k gevent -t 120 -D  LimApi.wsgi -b 0.0.0.0:8006` 即可。**










 

# Lim接口测试平台

### 介绍
Lim是Less is More（少即是多）的缩写，如它的名字一样我们希望用户在开展接口测试时所需的操作更少，但建设效率更高、实现的功能更多。因此我们做了许多交互细节上的优化和创新以及一些大胆的设计，比如：取消了局部变量、前后置计划、抛弃“先接口后用例”的传统建设思想，甚至还取消了“登录”！
你是否会疑问：这群Diao毛去掉了这些还如何高效的开展接口测试？
那还在等什么？赶快进入Lim的世界，体验简单又高效的接口测试吧！
#### 在线体验：[http://121.43.43.59/](http://121.43.43.59/) 
#### 功能特点：
1.全局参数管理
2.更优雅的接口管理
1. 弹窗拖拽
2. 多环境管理
3. 支持Python代码
#### 三分钟快速上手教程：[点我访问](https://thzfhzdqvc.feishu.cn/docx/FgCpdAEy2oDjP4xJOkFcIjyJnnf?from=from_copylink)
#### 答疑、定制化开发+微信：qu-niao
### 部署教程
#### 1）部署到Linux(会默认占用8001、8003端口）
1. 下载项目代码到你的Linux服务器（使用git或直接下载压缩包）;
2. 安装Python3.9+ 参考教程：[（Centos）Linux五大步安装Python](Pythonhttps://quniao.blog.csdn.net/article/details/120823163);
3. 安装Mysql5.7+ 参考教程：[（Centos）linux安装指定版本mysql教程-简易版](https://quniao.blog.csdn.net/article/details/119541983)（有数据库可修改LimApi/settings.py中的ENVIR项）;
4. 部署前端：
进入项目下的dist目录，执行:`nohup python3 -m http.server 80 &` （如果80端口被占用可切换为其他端口，例如：81） 
执行完成后访问对应服务器地址即可访问前端页面;
5. 部署后端：<br>
1）进入项目下的LimApi目录;<br>
2）执行依赖包安装命令：`pip3 install -r requirement.txt -i https://mirrors.aliyun.com/pypi/simple`;<br>
3）启动服务：`python3 -m gunicorn -w 6 -k gevent -t 180 -D  QNtest.wsgi -b 0.0.0.0:8001`; <br>
4）进入FileData目录执行命令:`nohup python3 -m http.server 8003 &`;<br>

**至此，不出意外的话，项目已部署成功！**

---
#### 快捷部署（windows）
待维护
#### 开发环境教程

前端环境
1.  安装nodejs
2.  安装yarn
3.  进入项目中的lim-web目录执行：`yarn&&yarn start`

---
后端环境
1.  安装python3.9+;
2.  安装mysql5.7+;
3.  进入目录执行依赖包安装命令：`pip install -r requirement.txt -i https://mirrors.aliyun.com/pypi/simple`;
4. 启动服务：`python manage.py runserver 0.0.0.0:8001`;
5.（可选）如果不涉及文件上传的操作可不执行：进入FileData目录执行命令`python3 -m http.server 8003`;



 
# Lim接口测试平台

### 介绍
Lim是Less is More（少即是多）的缩写，如它的名字一样，我们希望通过更少的交互让用户获得更友好方便的功能体验。为此我们做了很多创新大胆的设计，例如：打破常规的取消了局部变量、取消前后置计划、抛弃“先接口后用例”的传统自动化建设思想，甚至取消了“登录”！
你是否会疑问：这群Diao毛去掉了这些还如何高效的开展自动化？
那还在等什么？赶快进入Lim的世界，体验不一样的接口测试吧！
#### 在线体验：[http://121.43.43.59/](http://121.43.43.59/) 
#### 功能特点：
1. 弹窗拖拽
2. 
#### 使用文档：
#### 联系作者：
### 部署教程
#### 1）五大步部署到Linux(确保8001、8003端口未被占用）
1. 下载项目代码到你的Linux服务器（使用git或直接下载压缩包）
2. 安装Python3.9+ 参考教程：[Linux五大步安装Python](Pythonhttps://quniao.blog.csdn.net/article/details/120823163)
3. 安装Mysql5.7+ 参考教程：[linux安装指定版本mysql教程-简易版](https://quniao.blog.csdn.net/article/details/119541983)
4. 部署前端：
进入项目下的dist目录，执行:`nohup python3 -m http.server 80 &` （如果80端口被占用可切换为其他端口，例如：81） 
执行完成后访问对应服务器地址即可访问前端网页。
5. 部署后端：<br>
1）进入项目下的LimApi目录<br>
2）执行依赖包安装命令：`pip3 install -r requirement.txt -i https://mirrors.aliyun.com/pypi/simple`<br>
3）启动服务：`python3 -m gunicorn -w 6 -k gevent -t 180 -D  QNtest.wsgi -b 0.0.0.0:8001` <br>
4）进入FileData目录执行命令:`nohup python3 -m http.server 8003 &`<br>

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
1.  安装python3.9+
2.  安装mysql5.7+
3.  进入目录执行



 
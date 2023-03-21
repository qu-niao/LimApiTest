# Lim接口测试平台

### 介绍
Lim是Less is More(少即是多)的缩写，正如它的名字我们希望在开展接口测试时能够“四两拨千斤”！让用户操作更少但开展建设的效率更高。因此我们做了许多交互细节上的优化和创新以及一些大胆的设计，比如：取消了局部变量、前后置计划、抛弃“先接口后用例”的传统建设思想，甚至还取消了“登录”！<br/>
**你是否会疑问：这群Diao毛去掉了这些还如何高效的开展接口测试？**<br/>
**那还在等什么？赶快进入Lim的世界，看看Lim是怎么通过另一种方式让接口测试变得简单且高效的吧！**
#### 在线体验：[http://121.43.43.59/(推荐谷歌、火狐浏览器)](http://121.43.43.59/) (数据一周左右重置一次)
#### 技术栈
**前端：react+ant-design**
**后端：python3+django**
### 主功能介绍
#### 项目主页
![index](https://qu-niao.gitee.io/qu-niao-page/img/index.jpg)

#### 强大的接口编辑页
参数类型自动识别、自动管理接口入库，接口参数快速回填以及多种编辑模式让应对各类复杂参数游刃有余：

![api](https://qu-niao.gitee.io/qu-niao-page/img/apiM.jpg)


#### 参数池及执行控制
用例输出的变量全局定义的参数统一展示管理，有哪些参数一目了然，来源可追溯；用例执行状态可控制:
![var](https://qu-niao.gitee.io/qu-niao-page/img/globalVar2.jpg)
#### 多环境管理
能够配置多套环境参数，让一套用例能够在多套服务环境下执行:

![m_envir](https://qu-niao.gitee.io/qu-niao-page/img/more_envir.png)
![envir](https://qu-niao.gitee.io/qu-niao-page/img/envir.jpg)

#### 支持Python代码
用例变量生成、期望判断、执行条件设置等操作完全兼容python代码：

![code](https://qu-niao.gitee.io/qu-niao-page/img/code.jpg)
#### 更灵活的循环控制
循环控制支持多层嵌套，循环次数支持变量以及支持代码形式break操作：

![foreach](https://qu-niao.gitee.io/qu-niao-page/img/foreach.jpg)
#### 强大的步骤控制器
用例步骤支持延时等待、重试次数及执行条件设置。交换简单且更加灵活：

![controller](https://qu-niao.gitee.io/qu-niao-page/img/controller.jpg)
#### 步骤编辑功能
步骤支持合并、复制、拖拽改变排序，批量禁用等功能。一页俱全：
![step](https://qu-niao.gitee.io/qu-niao-page/img/step.jpg)

#### “免登录”设计
安全的操作无需登录，让非用例建设人员查看数据报表、报告情况更加快捷方便，减少多余的账号管理和登录操作：
![login](https://qu-niao.gitee.io/qu-niao-page/img/login.jpg)
#### 弹窗拖拽
所有弹窗皆可拖拽，展示内容更加自由可控：
![drag](https://qu-niao.gitee.io/qu-niao-page/img/drag.jpg)
### 三分钟快速上手教程：[点我访问](https://thzfhzdqvc.feishu.cn/docx/FgCpdAEy2oDjP4xJOkFcIjyJnnf)
### 答疑、定制化开发+微信：qu-niao：
![vx](https://qu-niao.gitee.io/qu-niao-page/img/vx.jpg)
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
4.  进入LimApi目录执行依赖包安装命令：`pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple`;
5. 修改`LimApi/LimApi/settings.py`文件的`DATABASES`数据库配置；
6. 启动服务：`python manage.py runserver 0.0.0.0:8001`;
7. （可选）如果不涉及文件上传的操作可不执行：新开cmd窗口进入FileData目录执行命令`python3 -m http.server 8003`;

**注意：因为django默认启动为单线程模式，所以上述的部署方式无法进行并发操作（例：在用例执行的同时进行中断执行的操作）所以可以通过UWSGI来启动项目。对于Linux系统推荐`gunicorn`+`gevent`的方式部署，本项目中的`requirements.txt`已集成了这两个库，所以在linux服务器上将启动命令更换为：`python3 -m gunicorn -w 5 -k gevent -t 120 -D  LimApi.wsgi -b 0.0.0.0:8006` 即可。**

---

在未来的版本还会加入测试报告、Swagger导入、自定义函数以及执行实时监控等功能。大家提出的问题和BUG也会尽量解决。让我们一起成长吧！

**开源不易，全靠用爱发电，如果对你有帮助请给我们点个Star：**


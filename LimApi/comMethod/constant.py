# --执行状态 start--
WAITING = 0  # 等待执行
FAILED = 1  # 执行失败
RUNNING = 2  # 执行中
FINISH = 3  # 执行完成
SUCCESS = 4  # 执行成功
SKIP = 5  # 跳过执行
INTERRUPT = 6  # 中断执行
DISABLED = 7  # 被禁用
FAILED_STOP = 8  # 失败中断
STATUS_LABEL = {WAITING: '等待执行', FAILED: '失败', RUNNING: '执行中', FINISH: '执行完成', SUCCESS: '成功', SKIP: '跳过',
                INTERRUPT: '中断', DISABLED: '禁用', FAILED_STOP: '失败中断'}
# --执行状态 end--
API_HEADER = 'header'
API_HOST = 'host'
API_VAR = 'var'
API_FOREACH = 'foreach'
API = 'api'
API_CASE = 'case'
API_SQL = 'sql'
API_FUNC = 'api_func'
API_TYPE_LABEL = {
    API_HEADER: '全局请求头',
    API_HOST: '全局请求地址',
    API_VAR: '全局变量',
    API_FOREACH: '循环控制器',
    API: '接口',
    API_CASE: '引用测试用例',
    API_SQL: 'SQL语句',
    API_FUNC: '自定义函数',
}
# --DB--
DB = 'db'
DIY_CFG = 1  # 自定义配置
PRO_CFG = 2  # 关联项目配置
TABLE_MODE = 1  # 用例填写参数时的方式，列表格式
JSON_MODE = 2  # 用例填写参数时的方式，Json格式
TEXT_MODE = 3  # 用例填写参数时的方式，文本格式
FORM_MODE = 4  # 用例填写参数时的方式，表单格式
CODE_MODE = 5  # 用例填写参数时的方式，代码格式
FORM_FILE_TYPE = 1
FORM_TEXT_TYPE = 2
DEFAULT_MODULE_NAME = '默认模块'
USER_API = 1
SWAGGER_API = 2
VAR_PARAM = 3
HEADER_PARAM = 2
HOST_PARAM = 1
# ---参数类型枚举
STRING = 'string'
OBJECT = 'object'
BOOL = 'boolean'
NUMBER = 'number'
PY_TO_CONF_TYPE = {"<class 'int'>": NUMBER, "<class 'float'>": NUMBER,
                   "<class 'dict'>": OBJECT, "<class 'list'>": OBJECT, "<class 'bool'>": BOOL, "<class 'str'>": STRING}
# ---
VAR_REGEX = r'\${(.*?)}'  # 取变量的正则规则
MYSQL = 'mysql'
REDIS = 'rds'
# ---期望判断规则枚举---
EQUAL = 1  # 相等
NOT_EQUAL = 2  # 不相等
CONTAIN = 3  # 包含
NOT_CONTAIN = 4  # 不包含
HAVE_KEY = 5  # 字段存在即可

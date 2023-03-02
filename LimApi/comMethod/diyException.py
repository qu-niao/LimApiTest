class DiyBaseException(Exception):
    """
    用例中步骤为计划的嵌套层级过多的报错
    """

    def __init__(self, label):
        self.label = label

    def __str__(self):
        return self.label


class NotFoundFileError(DiyBaseException):
    """
    没有找到文件
    """


class CaseCascaderLevelError(Exception):
    """
    用例中步骤为计划的嵌套层级过多的报错
    """

    def __init__(self, label):
        self.label = label

    def __str__(self):
        return self.label

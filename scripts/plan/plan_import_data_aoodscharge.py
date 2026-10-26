#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Importer(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf-8'):

        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.INSERT_DATA_AOODSCHARGE = """
            INSERT INTO data.aoodscharge (aid, name, price, surplus, type, status, sort) VALUES %s;
        """

    def checkAoods(self, aid):

        self.cursor.execute("SELECT aid FROM data.aoods WHERE aid = %s", (aid, ))
        return self.cursor.fetchone() is not None

    def main(self, pid, path, aid):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            if not self.checkAoods(aid):
                raise ValueError('辅材不存在, aid: %s' % aid)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise ValueError('The query result is zero!')

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": 10,
                "plan.status": 4
            })

            res = []
            valus = """ (%s, "%s", %s, %s, %s, %s, %s) """
            done = 0

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if self.paramCheck('^[^"]{1,100}$', v[0].strip()) == False:
                        raise ValueError('费用名称格式错误, 请输入100个以下字符且不含双引号')

                    if self.paramCheck(r'^(\d*|\d+\.[0-9]{1,3})$', str(float(v[1]))) == False:
                        raise ValueError('价格格式错误, 请输入最多3位小数的数字')

                    if self.paramCheck(r'^(\d*|\d+\.[0-9]{1,3})$', str(float(v[2]))) == False:
                        raise ValueError('浮动额格式错误, 请输入最多3位小数的数字')

                    if self.paramCheck('^[0-1]$', str(int(float(v[3])))) == False:
                        raise ValueError('类型格式错误, 请输入0-通用或1-超阶')

                    if self.paramCheck('^[0-1]$', str(int(float(v[4])))) == False:
                        raise ValueError('状态格式错误, 请输入0-启用或1-禁用')

                    if self.paramCheck(r'^\d{1,9}$', str(int(float(v[5])))) == False:
                        raise ValueError('排序格式错误, 请输入非负整数')

                    name = v[0].strip()
                    price = int(round(float(v[1]) * 1000))
                    surplus = int(round(float(v[2]) * 1000))
                    types = int(float(v[3]))
                    status = int(float(v[4]))
                    sort = int(float(v[5]))

                    data = (aid, name, price, surplus, types, status, sort)

                    res.append(valus % data)

                    if (len(res) % 200) == 0:

                        self.importCommit(res, self.INSERT_DATA_AOODSCHARGE)

                        done = done + len(res)
                        res = []

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": 10 + int(done * 85.0 / lengths),
                        })

                except Exception as e:

                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.importCommit(res, self.INSERT_DATA_AOODSCHARGE)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入辅材费用脚本说明:
        在辅材费用页创建导入计划并上传导入文件到文件服务器,可从计划页面看出是否导入成功;
        导入文件列顺序: 费用名称 | 价格(元,最多3位小数) | 浮动额(元,最多3位小数) | 类型(0-通用/1-超阶) | 状态(0-启用/1-禁用) | 排序(非负整数);
        价格/浮动额按千元位存储(页面值*1000),与页面添加经tranargs折算口径一致;
        aid须为data.aoods已存在辅材,否则整单失败;逐行校验,错误行跳过并记log上传文件服务器,不影响其余行;

        脚本传参说明:
        python plan_import_data_aoodscharge.py pid path aid
        python plan_import_data_aoodscharge.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 1001
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    aid = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, int(aid))

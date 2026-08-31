#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Importer(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):

        self.dbconn = None
        self.cursor = None
        self.flag = True

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.INSERT_DATA_SOODS = """
            INSERT INTO data.soods (name, gid, format, num, selling, cost, balance, type, status, company) VALUES %s;
        """

    def getGoodsMap(self, company):

        goodsMap = {}
        dupSet = set()

        self.cursor.execute("SELECT no, gid FROM data.goods WHERE company = %s", (company, ))
        goods = self.cursor.fetchall()

        for goodsPO in goods:

            if goodsPO[0] in goodsMap or goodsPO[0] in dupSet:
                dupSet.add(goodsPO[0])
                goodsMap.pop(goodsPO[0], None)
            else:
                goodsMap[goodsPO[0]] = goodsPO[1]

        return goodsMap, dupSet

    def main(self, pid, path, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            goodsMap, dupSet = self.getGoodsMap(company)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise ValueError('The query result is zero!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            res = []
            valus = """ ("%s", %s, "%s", %s, %s, %s, %s, %s, %s, %s) """

            status = 1

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if self.paramCheck('^.{1,64}$', v[0]) == False:
                        raise ValueError('商品编号格式错误, 请输入64个以下字符')

                    if v[0] in dupSet:
                        raise ValueError('商品编号重复,无法唯一确定商品')

                    if v[0] not in goodsMap:
                        raise ValueError('商品编号不存在')

                    if self.paramCheck('^.{1,64}$', v[1]) == False:
                        raise ValueError('选材名称格式错误, 请输入64个以下字符')

                    if self.paramCheck('^.{0,64}$', v[2]) == False:
                        raise ValueError('规格格式错误, 请输入64个以下字符')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[3]))) == False:
                        raise ValueError('数量格式错误, 请输入小数格式')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[4]))) == False:
                        raise ValueError('售价格式错误, 请输入小数格式')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[5]))) == False:
                        raise ValueError('成本格式错误, 请输入小数格式')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[6]))) == False:
                        raise ValueError('结算价格式错误, 请输入小数格式')

                    if self.paramCheck('^[0-2]$', str(int(v[7]))) == False:
                        raise ValueError('类型格式错误, 请输入0-2的整数')

                    no = v[0]
                    gid = goodsMap[no]
                    name = v[1]
                    formats = v[2]
                    num = int(float(v[3])*1000)
                    selling = int(float(v[4])*1000)
                    cost = int(float(v[5])*1000)
                    balance = int(float(v[6])*1000)
                    types = int(v[7])

                    data = (name, gid, formats, num, selling, cost, balance, types, status, company)

                    res.append(valus % data)

                    if (i % 200) == 0:

                        self.importCommit(res, self.INSERT_DATA_SOODS)

                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:

                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.importCommit(res, self.INSERT_DATA_SOODS)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入选材脚本说明:
        在选材页中创建导入选材计划,并上传导入选材的文件到文件服务器中,可从计划页面看出是否导入成功;
        商品编号按当前公司解析data.goods,不存在则跳过并记log;导入行的数量/售价/成本/结算价按千元位存储(页面值*1000);
        新导入的选材状态为无效(1),与页面添加一致,需在页面启用;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;

        脚本传参说明:
        python plan_import_data_soods.py pid path company
        python plan_import_data_soods.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 1
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    company = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, int(company))

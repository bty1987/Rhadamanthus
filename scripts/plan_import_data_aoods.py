#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Importer(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):

        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.flag = True

        self.INSERT_AOODS = """
            INSERT INTO data.aoods (name, gid, nid, atid, satid, bompany, atttype, balance, selling, cnid, normunit, normnum, storeunit, storenum, company, status) VALUES %s;
        """

    def main(self, pid, path, company):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

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
            valus = """ ("%s", %s, %s, %s, %s, %s, %s, %s, %s, %s, "%s", %s, "%s", %s, %s, %s) """

            status = 0

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if self.paramCheck('^.{1,64}$', v[0]) == False:
                        raise ValueError('辅材名称格式错误, 请输入64个以下字符')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[1]))) == False:
                        raise ValueError('商品ID格式错误, 请输入正整数')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[2]))) == False:
                        raise ValueError('定材ID格式错误, 请输入正整数')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[3]))) == False:
                        raise ValueError('分类辅类ID格式错误, 请输入正整数')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[4]))) == False:
                        raise ValueError('排序辅类ID格式错误, 请输入正整数')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[5]))) == False:
                        raise ValueError('归属公司ID格式错误, 请输入正整数')

                    if self.paramCheck('^[01]{1}$', str(int(v[6]))) == False:
                        raise ValueError('业务类型格式错误, 请输入0(标准)/1(外辅)')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[7]))) == False:
                        raise ValueError('结算价格式错误, 请输入小数格式')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[8]))) == False:
                        raise ValueError('售价格式错误, 请输入小数格式')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[9]))) == False:
                        raise ValueError('工程节点ID格式错误, 请输入正整数')

                    if self.paramCheck('^.{1,32}$', v[10]) == False:
                        raise ValueError('定额单位格式错误, 请输入32个以下字符')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[11]))) == False:
                        raise ValueError('定额数量格式错误, 请输入小数格式')

                    if self.paramCheck('^.{1,32}$', v[12]) == False:
                        raise ValueError('库房单位格式错误, 请输入32个以下字符')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[13]))) == False:
                        raise ValueError('库房数量格式错误, 请输入小数格式')

                    name = v[0]
                    gid = int(v[1])
                    nid = int(v[2])
                    atid = int(v[3])
                    satid = int(v[4])
                    bompany = int(v[5])
                    atttype = int(v[6])
                    balance = int(float(v[7])*1000)
                    selling = int(float(v[8])*1000)
                    cnid = int(v[9])
                    normunit = v[10]
                    normnum = int(float(v[11])*1000)
                    storeunit = v[12]
                    storenum = int(float(v[13])*1000)

                    data = (name, gid, nid, atid, satid, bompany, atttype, balance, selling, cnid, normunit, normnum, storeunit, storenum, company, status)

                    res.append(valus % data)

                    if (i % 200) == 0:

                        self.importCommit(res, self.INSERT_AOODS)

                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:

                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.importCommit(res, self.INSERT_AOODS)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入辅材脚本说明:
        在辅材中创建导入辅材计划,并上传导入辅材的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;

        脚本传参说明:
        python plan_import_data_aoods.py pid path company
        python plan_import_data_aoods.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 1
        测试用文件 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 正确
        测试用文件 group1/M00/1C/0C/wKgFZ1wUjhGAEtbLAABMADqpIBU664.xls 错误
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

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

        self.INSERT_PRESIGNPRICE = """
            INSERT INTO quotation.presignprice (ppid, name, upperArea, lowerArea, price, costPrice, mostPrice, activityPrice, status) VALUES %s;
        """

    def main(self, pid, path, ppid):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise ValueError('Excel文件内容为空!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            res = []

            # SQL语句前部分 - 验证ppid是否存在
            sql_prefix = []
            sql_prefix.append("set @ppid_exists = (select count(*) from quotation.presignproduce where ppid = %s);" % ppid)
            sql_prefix.append("")
            sql_prefix.append("drop temporary table if exists tmp;")
            sql_prefix.append("create temporary table tmp(pspid int(11));")
            sql_prefix.append("insert into tmp (pspid) select pspid from quotation.presignprice where ppid = %s;" % ppid)
            sql_prefix.append("update quotation.presignprice pp, tmp t set status = 2 where pp.pspid = t.pspid;")
            sql_prefix.append("delete from quotation.presignprice where status = 2;")
            sql_prefix.append("")

            # 先执行前缀SQL
            for sql in sql_prefix:
                res.append(sql)

            self.importCommit(res, "")

            valus = """ (%s, '%s', %s, %s, %s, %s, %s, %s, 0) """

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if len(v) < 7:
                        raise ValueError('数据格式错误，每行需要7列数据')

                    # 数据验证和处理
                    name = v[0].strip()
                    upperArea_value = v[1].strip()
                    lowerArea_value = v[2].strip()
                    price_value = v[3].strip()
                    costPrice_value = v[4].strip()
                    mostPrice_value = v[5].strip()
                    activityPrice_value = v[6].strip()

                    # 验证必填字段
                    if not name:
                        raise ValueError('名称不能为空')

                    if not upperArea_value:
                        raise ValueError('起始面积不能为空')

                    if not lowerArea_value:
                        raise ValueError('终止面积不能为空')

                    if not price_value:
                        raise ValueError('价格不能为空')

                    if not costPrice_value:
                        raise ValueError('工程成本不能为空')

                    if not mostPrice_value:
                        raise ValueError('主材成本不能为空')

                    if not activityPrice_value:
                        raise ValueError('浮动额不能为空')

                    # 验证数值格式
                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(upperArea_value)):
                        raise ValueError('起始面积格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(lowerArea_value)):
                        raise ValueError('终止面积格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(price_value)):
                        raise ValueError('价格格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(costPrice_value)):
                        raise ValueError('工程成本格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(mostPrice_value)):
                        raise ValueError('主材成本格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(activityPrice_value)):
                        raise ValueError('浮动额格式错误，请输入数字格式')

                    # 转换为整数存储（乘以1000）
                    upperArea = int(float(upperArea_value) * 1000)
                    lowerArea = int(float(lowerArea_value) * 1000)
                    price = int(float(price_value) * 1000)
                    costPrice = int(float(costPrice_value) * 1000)
                    mostPrice = int(float(mostPrice_value) * 1000)
                    activityPrice = int(float(activityPrice_value) * 1000)

                    data = (ppid, name, upperArea, lowerArea, price, costPrice, mostPrice, activityPrice)

                    res.append(valus % data)

                    # 每200条提交一次
                    if (i % 200) == 0:

                        self.importCommit(res, self.INSERT_PRESIGNPRICE)

                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:

                    error_msg = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, error_msg, False)

            # 提交剩余数据
            self.importCommit(res, self.INSERT_PRESIGNPRICE)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
    导入预签价格脚本说明:
        在预签价格中创建导入预签价格计划,并上传导入预签价格的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;

    脚本传参说明:
        python plan_import_quotation_presign_price.py pid path ppid
        python plan_import_quotation_presign_price.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3dE247.xls 123
        参数说明:
            pid: 计划ID
            path: 文件路径
            ppid: 预签产品ID (预签产品的主键ID)
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    ppid = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, ppid)

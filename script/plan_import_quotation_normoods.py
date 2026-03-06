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

        self.INSERT_NORMOOD = """
            INSERT INTO data.normood (name, qiid, normunit, normnum, storeunit, storenum, nid, price, status) VALUES %s;
        """

    def main(self, pid, path, quotationVersion):

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

            # SQL语句前部分
            sql_prefix = []
            sql_prefix.append("set @qvid = (select qvid from quotation.quotationversion where no = '%s');" % quotationVersion)
            sql_prefix.append("")
            sql_prefix.append("drop temporary table if exists tmp;")
            sql_prefix.append("create temporary table tmp(ngid int(11));")
            sql_prefix.append("insert into tmp (ngid) select ng.ngid from quotation.quotationitem qi, data.normood ng where qi.qvid = @qvid and qi.qiid = ng.qiid;")
            sql_prefix.append("update data.normood ng, tmp t set status = 2 where ng.ngid = t.ngid;")
            sql_prefix.append("delete from data.normood where status = 2;")
            sql_prefix.append("")

            # 先执行前缀SQL
            for sql in sql_prefix:
                res.append(sql)

            self.importCommit(res, "")

            valus = """ ('%s', %s, '%s', %s, '%s', %s, %s, %s, 0) """

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if len(v) < 8:
                        raise ValueError('数据格式错误，每行需要8列数据')

                    # 数据验证和处理
                    name = v[0].strip()
                    qiid = v[1].strip()
                    nid = v[2].strip()
                    normunit = v[3].strip()
                    normnum_value = v[4].strip()
                    storeunit = v[5].strip()
                    storenum_value = v[6].strip()
                    price_value = v[7].strip()

                    # 验证必填字段
                    if not name:
                        raise ValueError('名称不能为空')

                    if not qiid:
                        raise ValueError('报价项ID不能为空')

                    if not nid:
                        raise ValueError('定材ID不能为空')

                    if not normunit:
                        raise ValueError('定额单位不能为空')

                    if not storeunit:
                        raise ValueError('库房单位不能为空')

                    # 验证数值格式
                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(normnum_value)):
                        raise ValueError('定额量格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(storenum_value)):
                        raise ValueError('库房量格式错误，请输入数字格式')

                    if not self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(price_value)):
                        raise ValueError('价格格式错误，请输入数字格式')

                    # 转换为整数存储（乘以1000）
                    normnum = int(float(normnum_value) * 1000)
                    storenum = int(float(storenum_value) * 1000)
                    price = int(float(price_value) * 1000)

                    data = (name, qiid, normunit, normnum, storeunit, storenum, nid, price)

                    res.append(valus % data)

                    # 每200条提交一次
                    if (i % 200) == 0:

                        self.importCommit(res, self.INSERT_NORMOOD)

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
            self.importCommit(res, self.INSERT_NORMOOD)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
    导入定额材料脚本说明:
        在定额材料中创建导入定额材料计划,并上传导入定额材料的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;

    脚本传参说明:
        python plan_import_quotation_normoods.py pid path quotationVersion
        python plan_import_quotation_normoods.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3dE247.xls QV_160
        参数说明:
            pid: 计划ID
            path: 文件路径
            quotationVersion: 报价版本号 (如: QV_160)
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    quotationVersion = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, quotationVersion)

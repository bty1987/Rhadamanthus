#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Exporter(Util):

    def __init__(self, host='', username='', password='', media='', pthost="", charset='utf8'):
    
        self.dbconn = None
        self.cursor = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost
        self.flag = True

        self.size = 300

        self.colum = u"""
            g.gid AS "商品ID",
            g.no AS "编号",
            g.name AS "商品名称",
            g.barcode AS "条形码",
            g.category AS "品类",
            g.bid AS "品牌ID",
            b.brand AS "品牌",
            g.measurementUnit AS "单位",
            g.pieceNum AS "单价",
            g.type AS "类型"
        """

        self.SQL_EXPORT_INVENTORY_GOODS = u"""
            SELECT %s FROM data.goods g, communion.brand b WHERE %s %s
        """

    # 公司条件识别
    def company(self, cloumCompany, company, args):

        companyId = u"%s %s = %s" % (args != '' and 'AND' or '', cloumCompany, company)

        return companyId

    def main(self, pid, args, company):
    
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            parameter = args.split(u',')
            strs = ""
            
            for i, v in enumerate(parameter):
            
                if v == "": continue
            
                parm = v.split(u'-')
                
                if len(parm) != 2: continue
                
                if parm[0] == "status":
                    strs = strs + u""" %s g.%s = %s """ % (i != 0 and "AND" or "", parm[0], parm[1])
                else:
                    strs = strs + u""" %s g.%s like "%%%s%%" """ % (i != 0 and "AND" or "", parm[0], parm[1])
                
            countSQL = self.SQL_EXPORT_INVENTORY_GOODS % (u"count(*)", strs, self.company(u"g.company", company, strs))
            count = self.count(countSQL)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    u"plan.status": 3,
                    u"plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                u"plan.schedule": schedule,
                u"plan.status": 4
            })

            params = self.createWorkbook(u"sheet1")
            workbook = params[0]
            sheet = params[1]

            tableHead = [u"商品ID", u"商品编码", u"商品名称", u"条形码", u"品类", u"品牌ID", u"品牌", u"单位", u"件数", u"类型"]
            tableHeadLen = len(tableHead)
            self.createTableHead(sheet, tableHead)

            sql = self.SQL_EXPORT_INVENTORY_GOODS % (self.colum, strs, self.company(u"g.company", company, strs))
            
            nowPage = 1
            length = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    rows = list(v)
                    
                    self.divNum(rows, [8])
                    
                    for index in range(0, tableHeadLen):
                        self.writeWorkbook(sheet, length, index, rows[index])

                    length = length + 1

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    u"plan.schedule": int(schedules)
                })

                nowPage = nowPage + 1

                if len(data) < self.size:
                    flag = False

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                u"plan.resultFilepath": resultfilepath
            })

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导出商品脚本说明:
            根据查询条件,以分页拿数据的方式导出商品;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.传入必须参数说明
            1.pid         information.plan的主键;
            2.args        查询条件(由页面传入) 对应数据库的字段名-字段值,方式拼接;
            
        2.使用
            python plan_export_inventory_goods.py pid args company
            python plan_export_inventory_goods.py 942 no-UDJ293JJK23,name-水泥,barcode-UDJ293JJK23,brand-圣象地板,status-0, 1
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")
    
    if len(sys.argv) == 4:
        pid = sys.argv[1]
        args = sys.argv[2]
        company = sys.argv[3]
    else:
        pid = sys.argv[1]
        args = ""
        company = sys.argv[3]

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    exporter.main(pid, args, int(company))

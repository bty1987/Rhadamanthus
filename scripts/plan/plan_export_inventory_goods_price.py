#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Export(Util):

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

        self.colum = """
            g.gid AS "商品ID",
            g.no AS "编号",
            g.name AS "商品名称",
            p.name AS "价格说明",
            p.purchase AS "控价",
            p.selling AS "售价",
            p.confine AS "限价",
            p.ctype AS "结算类型",
            p.cvalue AS "结算值",
            p.type AS "类型",
            g.category AS 品类,
            g.brand AS 品牌
        """

        self.SQL_QUERY = """
            SELECT %s FROM data.goods g, data.price p WHERE p.gid = g.gid and %s %s
        """

    # 公司条件识别
    def company(self, cloumCompany, company, args):

        companyId = "%s %s = %s" % (args != '' and 'AND' or '', cloumCompany, company)

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
                
                strs = strs + """ %s g.%s like "%%%s%%" """ % (i != 0 and "AND" or "", parm[0], parm[1])

            countSQL = self.SQL_QUERY % ("count(*)", strs, self.company("g.company", company, strs))
            count = self.count(countSQL)

            if count == 0:
                self.flag = False
                self.updataSchedule(self.pthost, pid, {
                    "plan.status": 3,
                    "plan.info": '无可导出数据'
                })
                return False

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": schedule,
                "plan.status": 4
            })

            params = self.createWorkbook("sheet1")
            workbook = params[0]
            sheet = params[1]

            tableHead = [
                "商品ID", "商品编码", "商品名称", "价格说明", "控价", "售价", "限价", "结算类型", "结算值", "类型", 
                "品类", "品牌"
            ]
            tableHeadLen = len(tableHead)
            self.createTableHead(sheet, tableHead)

            sql = self.SQL_QUERY % (self.colum, strs, self.company("g.company", company, strs))
            
            nowPage = 1
            length = 1
            flag = True
            
            while (flag):

                data = self.page(sql, nowPage, self.size)

                for i, v in enumerate(data):
                
                    rows = list(v)
                    
                    self.divNum(rows, [4, 5, 6, 8])
                    
                    rows[7] = rows[7] == 0 and "底价" or "点位"
                    rows[9] = rows[9] == 0 and "正价" or "特价"
                    
                    for index in range(0, tableHeadLen):
                        self.writeWorkbook(sheet, length, index, rows[index])

                    length = length + 1

                molecular = molecular + len(data)
                schedules = (molecular / all) * 100

                self.updataSchedule(self.pthost, pid, {
                    "plan.schedule": int(schedules)
                })

                nowPage = nowPage + 1

                if len(data) < self.size:
                    flag = False

            resultfilepath = self.packFile(pid, workbook)

            self.updataSchedule(self.pthost, pid, {
                "plan.resultFilepath": resultfilepath
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
        python plan_export_inventory_goods_price.py pid args company
        python plan_export_inventory_goods_price.py 942 no-UDJ293JJK23,name-水泥,barcode-UDJ293JJK23,brand-圣象地板,status-0, 1
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

    export_goods = Export(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    export_goods.main(pid, args, int(company))

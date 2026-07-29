#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class export_common(Util):

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

        self.table = []
        self.tableSource = set([])
        self.column = []
        self.conditionData = []
        self.conditionDic = {}
        self.tableHead = []
        self.divlist = []
        self.attribute = []
        self.field = []
        self.conditionTpid = []

        self.size = 300

        self.SQL_INFORMATION_PLANPARAM = u"""
                   SELECT
                       %s
                   FROM
                       information.planparam
                   WHERE
                       pid = %s
               """

        self.SQL_DATA_TASKPARAMS = u"""
                    SELECT
                        *
                    FROM
                        data.taskparam
                """

        self.SQL_EXPORT_INVENTORY_ACCESSORIES = u"""
            SELECT
                %s
            FROM
                %s
            WHERE
                %s
        """

    def handles(self, pid):

        paramSql = self.SQL_INFORMATION_PLANPARAM % (u"`fields`,conditions", pid)
        self.cursor.execute(paramSql)
        param_dict = dict(zip([col[0] for col in self.cursor.description], self.cursor.fetchone()))

        fields = param_dict['fields'].split(",")
        conditions = param_dict['conditions'].split(",")
        conditionTpid = []

        for condition in conditions:
            conditionTpid.append(condition.split("|")[0])
            self.conditionDic[int(condition.split("|")[0])] = condition.split("|")[1]

        self.field = sorted([int(x) for x in fields])
        self.conditionTpid = sorted([int(x) for x in conditionTpid])

        sql = self.SQL_DATA_TASKPARAMS
        self.cursor.execute(sql)

        data_dict = [dict(zip([col[0] for col in self.cursor.description], row)) for row in self.cursor.fetchall()]

        return data_dict

    def handleData(self, data):

        unionParam = set([])
        for i, v in enumerate(data):
            if v['tpid'] in self.field:
                self.handleColumn(v)
                self.handleTable(v)
                self.handleTableHead(v)
                self.handleDivNum(v)
                self.handleAttribute(v)
                if v['unionParam'] == 0: continue
                if v['unionParam'] in self.field: continue
                unionParam.add(v['unionParam'])

            elif v['tpid'] in self.conditionTpid:
                self.handleCondition(v)

            if v['tpid'] in unionParam:
                self.handleTable(v)

        for t in sorted(self.tableSource, key=lambda table: table[1]):
            self.table.append(t[0])

    # 对字段显示的处理 column
    def handleColumn(self, v):

        if v['type'] == 0:
            text = u"%s AS '%s'" % (v['field'], v['name'])
            self.column.append(text)

    # 对表关联的处理 LEFT JOIN
    def handleTable(self, v):

        if v['ismain'] == 0:
            table = (u"%s %s" % (v['tableName'].strip(), v['alias'].strip()), v['tablesort'])
        else:
            table = (u"%s %s ON %s" % (v['tableName'].strip(), v['alias'].strip(), v['unionField'].strip()), v['tablesort'])
        self.tableSource.add(table)

    # 对条件进行处理 condition
    def handleCondition(self, v):

        for item in self.conditionDic.items():
            if item[0] != v['tpid']:continue
            date = self.checkDate(item[1])
            if date:
                startTime, endTime = item[1].split("-")
                flags = self.controlTime(startTime, endTime)
                if flags == False:
                    raise RuntimeError(u'时间应在1-31内')
                condition = u"%s >= '%s 00:00:00' and %s <= '%s 23:59:59'" % (
                v['field'], startTime, v['field'], endTime)
            else:
                condition = u"%s = %s" % (v['field'], item[1])
            self.conditionData.append(condition)

    # 判断是否是日期格式
    def checkDate(self, date):

        pattern = re.compile(r"(\d{4}/\d{1,2}/\d{1,2}-\d{4}/\d{1,2}/\d{1,2})")
        result = pattern.search(date)

        return result

    # 对标题进行处理 TableHead
    def handleTableHead(self, v):

        if v['type'] == 0:
            self.tableHead.append(v['name'])

    # 对数值进行处理 divNum
    def handleDivNum(self, v):

        if v['oneType'] == 1:
            self.divlist.append(self.field.index(v['tpid']))

    # 对状态,类型处理 status,type
    def handleAttribute(self, v):

        if v['handle'] != None and v['handle'] != "":
            handle = {'id': self.field.index(v['tpid']), 'name': v['handle']}
            self.attribute.append(handle)

    def main(self, pid):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            data_dic = self.handles(pid)
            self.handleData(data_dic)

            column = ",".join(self.column)
            table = " LEFT JOIN ".join(self.table)
            condition = " AND ".join(self.conditionData)

            countSQL = self.SQL_EXPORT_INVENTORY_ACCESSORIES % (u"count(*)", table, condition)
            count = self.count(countSQL)

            if count == 0:
                raise RuntimeError(u'The query result is zero!')

            all = count / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            plan = {
                u"plan.schedule": schedule,
                u"plan.status": 4
            }
            self.updataSchedule(self.pthost, pid, plan)

            params = self.createWorkbook(u"sheet")
            workbook = params[0]
            sheet = params[1]

            self.createTableHead(sheet, self.tableHead)

            path = tempfile.gettempdir() + u"/sheet.xls"
            self.saveWorkbook(path, workbook)

            sql = self.SQL_EXPORT_INVENTORY_ACCESSORIES % (column, table, condition)

            nowPage = 1
            length = 1
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)
                    self.divNum(data, self.divlist)
                    self.handleStatus(data, self.attribute)

                    self.createTableHead(sheet, data, length)

                    length = length + 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                plan = {
                    u"plan.schedule": int(schedules)
                }

                self.updataSchedule(self.pthost, pid, plan)

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

            self.saveWorkbook(path, workbook)

            url = self.media + u"uploadOther.do"
            resultfilepath = self.uploudFile(path, url)

            self.delFile(path)

            plan = {
                u"plan.resultFilepath": resultfilepath
            }

            self.updataSchedule(self.pthost, pid, plan)

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)

            sys.exit(0)


if __name__ == '__main__':
    """
    导出通用脚本说明:
        根据查询条件,以分页拿数据的方式导出对应脚本;并上传到文件服务器中,可从任务页面上点击下载即可;
        当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
    1.传入必须参数说明
        1.pid         information.plan的主键;

    2.使用
        plan_export_common.py pid
        plan_export_common.py pid  2536
        """
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]

    common = export_common(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    common.main(pid)

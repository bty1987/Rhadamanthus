#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from openpyxl import Workbook

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
        self.tableSource = []
        self.column = []
        self.conditionData = []
        self.conditionDic = {}
        self.tableHead = []
        self.divlist = []
        self.attribute = []
        self.field = []
        self.conditionTpid = []

        # 单sheet最大行数,超过自动切下一sheet,避免单sheet过大
        self.sheetMaxRow = 500000

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
                        communion.taskparam
                    WHERE
                        tid = %s
                        AND status = 0
                    ORDER BY
                        tablesort, sort
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
            if not condition or "|" not in condition: continue
            conditionTpid.append(condition.split("|")[0])
            self.conditionDic[int(condition.split("|")[0])] = condition.split("|")[1]

        self.field = sorted([int(x) for x in fields])
        self.conditionTpid = sorted([int(x) for x in conditionTpid])

        # 先按 pid 反查 plan 拿到 tid, 只拉该任务的元数据, 避免全表扫描
        self.cursor.execute(u"SELECT tid FROM information.plan WHERE pid = %s" % pid)
        tidRow = self.cursor.fetchone()

        if not tidRow:
            raise RuntimeError(u"plan 不存在: pid=%s" % pid)

        tid = tidRow[0]

        sql = self.SQL_DATA_TASKPARAMS % tid
        self.cursor.execute(sql)

        data_dict = [dict(zip([col[0] for col in self.cursor.description], row)) for row in self.cursor.fetchall()]

        return data_dict

    def handleData(self, data):

        unionParam = set([])

        # 先把主表单独取出并放在 tableSource 第一位, 避免 set 无序导致主表跑到后面
        mainTableKeys = set([])

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

        # 增强5: 主表(ismain=0)强制排第一且去重, 从表按 (tablesort, alias) 排序
        # 同表多列只 JOIN 一次: 按 "tableName alias" 去重(主表从表统一处理)
        mainList = [t for t in self.tableSource if t[2] == 0]
        slaveList = [t for t in self.tableSource if t[2] != 0]

        seen = set([])
        dedupMain = []
        for t in mainList:
            if t[0] in seen: continue
            seen.add(t[0])
            dedupMain.append(t)

        dedupSlave = []
        for t in slaveList:
            key = t[0].split(u" ON ")[0]
            if key in seen: continue
            seen.add(key)
            dedupSlave.append(t)

        self.table = [t[0] for t in (dedupMain + sorted(dedupSlave, key=lambda x: (x[1], x[0])))]

    # 对字段显示的处理 column
    def handleColumn(self, v):

        if v['type'] == 0:
            text = self.renderColumn(v)
            self.column.append(text)

    # 增强4: handle 双格式渲染
    #   含两个点 "module.clazz.field" -> SQL 层 communion.kv 函数转换
    #   纯标识符(如 userinfo2LevelStatus) -> Python 层 handleStatus 转换(见 main 导出循环)
    #   空 -> 原样输出
    def renderColumn(self, v):

        field = v['field']
        name = v['name']
        handle = (v.get('handle') or u"").strip()

        if handle.count(u".") == 2:
            mod, clazz, fld = handle.split(u".")
            return u"communion.kv('%s','%s','%s', %s) AS '%s'" % (mod, clazz, fld, field, name)

        return u"%s AS '%s'" % (field, name)

    # 对表关联的处理 LEFT JOIN
    # 返回元组 (join片段, tablesort排序键, ismain), 供 handleData 排序去重
    def handleTable(self, v):

        if v['ismain'] == 0:
            table = (u"%s %s" % (v['tableName'].strip(), v['alias'].strip()), v['tablesort'], 0)
        else:
            table = (u"%s %s ON %s" % (v['tableName'].strip(), v['alias'].strip(), v['unionField'].strip()), v['tablesort'], 1)
        self.tableSource.append(table)

    # 增强3 + 增强2: 条件处理
    #   时间列优先用 type=2 的 field; 兼容旧逻辑: 条件值匹配日期正则也按时间区间处理
    #   等值条件 value 先校验转义, 防注入
    def handleCondition(self, v):

        for item in self.conditionDic.items():
            if item[0] != v['tpid']: continue

            value = item[1]

            if self.checkDate(value):
                startTime, endTime = value.split("-")
                flags = self.controlTime(startTime, endTime)
                if flags == False:
                    raise RuntimeError(u'时间应在1-31内')
                condition = u"%s >= '%s 00:00:00' and %s <= '%s 23:59:59'" % (self._escapeIdent(v['field']), startTime, self._escapeIdent(v['field']), endTime)
            else:
                safeValue = self._escapeValue(value)
                condition = u"%s = %s" % (self._escapeIdent(v['field']), safeValue)
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

        if v['handle'] != None and v['handle'] != u"":
            # 增强4: 含两点的 handle 走 kv, 已在 SQL 层转换, 不再进 Python handleStatus
            if (v['handle'].strip()).count(u".") == 2: return
            handle = {'id': self.field.index(v['tpid']), 'name': v['handle']}
            self.attribute.append(handle)

    # 增强2: 标识符(表名.字段)校验, 只允许 字母/数字/下划线/点/反引号
    def _escapeIdent(self, ident):

        if not re.match(r"^[A-Za-z0-9_.`]+$", ident or u""):
            raise RuntimeError(u"非法字段标识: %s" % ident)
        return ident

    # 增强2: 条件值校验转义
    #   数字/空 -> 原样
    #   安全字符串 -> 单引号包裹并转义内部单引号
    #   含非法字符 -> 拒绝
    def _escapeValue(self, value):

        if value is None: return u"NULL"

        s = u"%s" % value

        # 纯数字不加引号
        if re.match(r"^-?\d+(\.\d+)?$", s):
            return s

        # 安全字符: 中文/字母/数字/下划线/短横线
        if re.match(r"^[A-Za-z0-9_\u4e00-\u9fa5\-]+$", s):
            return u"'%s'" % s.replace(u"'", u"''")

        raise RuntimeError(u"非法条件值: %s" % value)

    def main(self, pid):
        try:
            self.getDBCursor(self.host, self.username, self.password, self.charset)

            data_dic = self.handles(pid)
            self.handleData(data_dic)

            column = u",".join(self.column)
            table = u" LEFT JOIN ".join(self.table)
            condition = u" AND ".join(self.conditionData)

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

            # 增强1: 使用 openpyxl xlsx, 支持超过 65535 行
            workbook = Workbook()
            sheet = workbook.active
            sheet.title = u"sheet"
            self._writeRow(sheet, self.tableHead)

            sql = self.SQL_EXPORT_INVENTORY_ACCESSORIES % (column, table, condition)

            nowPage = 1
            length = 1
            sheetIndex = 1
            sheetRowCount = 0
            flag = True

            while (flag):

                rows = self.page(sql, nowPage, self.size)

                for i, v in enumerate(rows):
                    data = list(v)
                    self.divNum(data, self.divlist)
                    self.handleStatus(data, self.attribute)

                    # 增强6: 单sheet超阈值自动切下一sheet
                    if sheetRowCount >= self.sheetMaxRow:
                        sheetIndex += 1
                        sheet = workbook.create_sheet(u"sheet_%d" % sheetIndex)
                        self._writeRow(sheet, self.tableHead)
                        sheetRowCount = 0

                    self._writeRow(sheet, data)
                    length = length + 1
                    sheetRowCount = sheetRowCount + 1

                molecular = molecular + len(rows)
                schedules = (molecular / all) * 100

                plan = {
                    u"plan.schedule": int(schedules)
                }

                self.updataSchedule(self.pthost, pid, plan)

                nowPage = nowPage + 1

                if len(rows) < self.size:
                    flag = False

            # 增强1: 用 packXlsxFile 打包上传 xlsx
            resultfilepath = self.packXlsxFile(pid, workbook)

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

    # 增强1: openpyxl 按行写入
    def _writeRow(self, sheet, data):

        row = []
        for v in data:
            row.append(u"%s" % v if v is not None else None)
        sheet.append(row)


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

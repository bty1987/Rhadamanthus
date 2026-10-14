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
        self.list = []
        self.size = 400

        self.CREATE_SQL_TMP = u"""
            CREATE TEMPORARY TABLE quotation.tmp(orderId varchar(15), qid int(11), nid int(11), numone int(10), numtwo int(10), numthr int(10))
        """
        self.REPLACE_SQL_TMP = u"""
            REPLACE INTO quotation.tmp(orderId, qid, nid, numone)
            SELECT
                nt.orderId,
                nt.qid,
                nmi.nid,
                sum(nmi.normnum) 'num'
            FROM
                quotation.normtion nt,
                quotation.normooditem nmi,
                decoration.decoration d
            WHERE 
                nt.createtime > '%s 00:00:00' AND 
                nt.createtime < '%s 23:59:59' AND 
                nt.qid = nmi.qid AND 
                nt.orderId = d.orderId AND 
                d.company = %s AND 
                nmi.type IN (0, 1, 2)
            GROUP BY
                nmi.qid,
                nmi.nid
        """
        self.DROP_SQL_TMP = u"""
            DROP TEMPORARY TABLE quotation.tmp
        """

        self.CREATE_SQL_TMPONE = u"""
            CREATE TEMPORARY TABLE quotation.tmp1(orderId varchar(15), qid int(11), nid int(11), numone int(10), numtwo int(10), numthr int(10))
        """
        self.REPLACE_SQL_TMPONE = u"""
            REPLACE INTO quotation.tmp1 (orderId, qid, nid, numtwo) 
            SELECT 
                t.orderId, 
                t.qid, 
                ai.nid, 
                sum(ai.num) 'num' 
            FROM 
                quotation.tmp t 
                LEFT JOIN inventory.accessories a ON t.orderId = a.orderId
                LEFT JOIN inventory.accessoriesitem ai ON a.aid = ai.aid AND t.nid = ai.nid
            GROUP BY 
                t.qid, 
                ai.nid
        """
        self.UPDATE_SQL_TMPONE = u"""
            UPDATE quotation.tmp t, quotation.tmp1 t1 set t.numtwo = t1.numtwo WHERE t.qid = t1.qid AND t.nid = t1.nid
        """
        self.DROP_SQL_TMPONE = u"""
            DROP TEMPORARY TABLE quotation.tmp1
        """

        self.CREATE_SQL_TMPTWO = u"""
            CREATE TEMPORARY TABLE quotation.tmp2(orderId varchar(15), qid int(11), nid int(11), numone int(10), numtwo int(10), numthr int(10))
        """
        self.REPLACE_SQL_TMPTWO = u"""
            REPLACE INTO quotation.tmp2 (orderId, qid, nid, numthr) 
            SELECT 
                t.orderId, 
                t.qid, 
                nmi.nid, 
                sum(nmi.normnum) 'num' 
            FROM 
                quotation.tmp t, 
                quotation.normooditem nmi
            WHERE 
                t.qid = nmi.qid AND 
                t.nid = nmi.nid AND 
                nmi.type = 3
            GROUP BY 
                nmi.qid, 
                nmi.nid
        """
        self.UPDATE_SQL_TMPTWO = u"""
            UPDATE quotation.tmp t, quotation.tmp2 t2 SET t.numthr = t2.numthr WHERE t.qid = t2.qid AND t.nid = t2.nid
        """
        self.DROP_SQL_TMPTWO = u"""
            DROP TEMPORARY TABLE quotation.tmp2
        """

        self.colum = u"""
            d.orderId AS '装修单号',
            communion.kv('decoration', 'decoration', 'typeness', d.typeness) AS `装修单类型`,
            v.name AS '楼盘',
            h.housenumber AS '楼号',
            du.userid AS '设计师工号',
            du.currentname AS '设计师',
            sv.userid AS '监理工号',
            sv.currentname AS '监理',
            no.name AS '定材名称',
            t.nid AS '定材ID',
            t.numone AS '定额数量',
            t.numtwo AS '实领数量',
            t.numthr AS '材料项数量'
        """

        self.EXPORTER_SQL_STR = u"""
            SELECT 
                %s
            FROM
                quotation.tmp t
                LEFT JOIN decoration.decoration d on t.orderId = d.orderId 
                LEFT JOIN communion.house h on d.hid = h.hid
                LEFT JOIN communion.village v on h.vid = v.vid
                LEFT JOIN data.noods no on t.nid = no.nid
                LEFT JOIN communion.user du on d.dsuid = du.uid
                LEFT JOIN communion.user sv on d.svuid = sv.uid
        """

    def sqlertmp(self, timeargs, company):

        startTime, endTime = timeargs.split("-")

        return self.REPLACE_SQL_TMP % (startTime, endTime, company)

    def rower(self, row):

        self.divNum(row, [10, 11, 12])

        return row

    def main(self, pid, args, company):

        tableheads = [
            u'装修单号', u'装修单类型', u'楼盘', u'楼号', u'设计师工号', u'设计师', u'监理工号', u'监理', u'定材名称',
            u'定材ID', u'定额数量', u'实领数量', u'材料项数量'
        ]

        self.getDBCursor(self.host, self.username, self.password, self.charset)

        self.cursor.execute(self.CREATE_SQL_TMP)
        self.commit()

        self.cursor.execute(self.CREATE_SQL_TMPONE)
        self.commit()

        self.cursor.execute(self.CREATE_SQL_TMPTWO)
        self.commit()

        sqltmp = self.sqlertmp(args, int(company))
        self.cursor.execute(sqltmp)
        self.commit()

        self.cursor.execute(self.REPLACE_SQL_TMPONE)
        self.commit()

        self.cursor.execute(self.REPLACE_SQL_TMPTWO)
        self.commit()

        self.cursor.execute(self.UPDATE_SQL_TMPONE)
        self.commit()

        self.cursor.execute(self.UPDATE_SQL_TMPTWO)
        self.commit()

        self.exporter(pid, args, u"定额", tableheads, self.colum, self.EXPORTER_SQL_STR, self.rower)

        self.cursor.execute(self.DROP_SQL_TMP)
        self.commit()

        self.cursor.execute(self.DROP_SQL_TMPONE)
        self.commit()

        self.cursor.execute(self.DROP_SQL_TMPTWO)
        self.commit()

if __name__ == '__main__':

    """
        导出定额材料定额以及实际使用数量信息说明:
            根据查询条件,以分页拿数据的方式导出导出定额材料定额以及实际使用数量信息;并上传到文件服务器中,可从任务页面上点击下载即可;
            当该脚本执行出现异常时,将跟新进度为失败并记录到log文件中上传至文件服务器中;
        1.参数说明参数要对应
            1.pid         information.plan的主键 299;
            2.args        2024/04/01-2024/04/10
            3.company     1
        2.脚本传参说明:
            plan_export_quotation_normooditem_number.py  pid args company
            plan_export_quotation_normooditem_number.py  299 2018/11/01-2018/11/30 1

    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")
    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    args = sys.argv[2]
    company = sys.argv[3]

    # pid = 299
    # args = "2024/04/01-2024/04/10"
    # company = 1

    exporter = Exporter(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))

    exporter.main(pid, args, company)
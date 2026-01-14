#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Updater(Util):

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

        self.limit = 100

        self.CREATE_AOODS_TEMP = """CREATE TABLE tempbase.tmpa(aid INT(11), status TINYINT(1), company INT(11))"""
        self.REPLACE_AOODS_TEMP = """REPLACE INTO tempbase.tmpa (aid, status, company) VALUES %s"""
        self.UPDATE_AOODS_STATUS = """UPDATE data.aoods a, tempbase.tmpa t SET a.status = t.status, a.company = t.company WHERE a.aid = t.aid"""
        self.DROP_AOODS_TEMP = """DROP TABLE tempbase.tmpa"""

    def main(self, pid, path):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            lists = self.readFilesByline(filePath, 0)

            lengths = len(lists)

            if lengths == 0:
                raise ValueError('The query result is zero!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            list = []

            self.cursor.execute(self.CREATE_AOODS_TEMP)
            self.commit()

            for i, v in enumerate(lists):

                try:

                    if self.paramCheck(r'^[0-9]\d*$', str(int(v[0]))) == False:
                        raise ValueError('辅材ID格式错误,请输入正整数')

                    if self.paramCheck(r'^[01]{1}$', str(int(v[2]))) == False:
                        raise ValueError('辅材状态格式错误,请输入0(启用)/1(禁用)')

                    if len(v) >= 4 and v[3] and v[3].strip() != "":
                        if self.paramCheck(r'^[0-9]\d*$', str(int(v[3]))) == False:
                            raise ValueError('归属公司ID格式错误,请输入正整数')
                        company = int(v[3])
                    else:
                        company = "NULL"

                    list.append("(%s, %s, %s)" % (int(v[0]), int(v[2]), company))

                    if (i % self.limit) == 0:

                        sql = self.REPLACE_AOODS_TEMP % (','.join(list))

                        self.cursor.execute(sql)
                        self.commit()

                        list = []

                        molecular = molecular + 1
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:

                    e = "请检查该行内容,错误内容在第%s行,%s." % (i+1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            if list and len(list) > 0:

                sql = self.REPLACE_AOODS_TEMP % (','.join(list))

                self.cursor.execute(sql)
                self.commit()

            self.cursor.execute(self.UPDATE_AOODS_STATUS)
            self.commit()

            self.cursor.execute(self.DROP_AOODS_TEMP)
            self.commit()

            self.delFile(filePath)

        except Exception as e:
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:
            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        批量更新脚本说明:
        创建批量更新辅材状态计划, 并上传批量更新的文件到文件服务器中, 可从计划页面看出是否更新成功;
        当该脚本执行出现异常时, 不影响进度并跳过错误的数据, 然后记录文件中第几条数据有异常, 并写到log文件中上传至文件服务器中;

        脚本传参说明:
        python plan_update_data_aoods_status.py pid path
        python plan_update_data_aoods_status.py 540 group5/M00/28/73/wKgFbGZF6jiAT13NAABKAAb0tC8757.xls
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    updater = Updater(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    updater.main(pid, path)

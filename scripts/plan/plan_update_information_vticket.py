#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Price(Util):
    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
        self.dbconn = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.flag = True
        self.UPDATE_VTICKET_SQL = """
                  update information.vticket v, communion.user u, communion.department d set v.buid = u.uid, v.did = d.did, v.rid = d.fdid
                  where v.tno in (%s) and u.userId = '%s' and u.deptid = d.did;
                """

    def main(self, pid, path):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            url = self.media + path
            filePath = self.downLoadFile(url, path)

            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise RuntimeError(u'The query result is zero!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            paln = {
                u"plan.schedule": int(schedule),
                u"plan.status": 4
            }
            self.updataSchedule(self.pthost, pid, paln)

            res = {}

            for i, v in enumerate(list):
                try:
                    tno = "'%s'" % (str(int(v[0])))
                    userId = str(v[1])
                    
                    if userId in res.keys():
                        res[userId].append(tno)
                    else:
                        res[userId] = [tno]

                except Exception as e:

                    e = u"请检查该行内容,错误内容在第%s行。%s。" % (i + 1, e)

                    self.errCall(pid, self.pthost, self.media, e, False)
                    
            for key in res.keys():
            
                sql = self.UPDATE_VTICKET_SQL % (",".join(res.get(key)), key)
                
                print(sql)

                self.cursor.execute(sql)
                self.commit()

            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media,self.flag)

            sys.exit(0)


if __name__ == '__main__':
    """
       脚本说明: 
       
       脚本传参说明:
        python plan_update_information_vticket.py <pid> <path>
        python plan_update_information_vticket.py 542 group1/M00/16/42/wKgFZ1um8vaAFdzJAABOAId-UH4635.xls
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    Price = Price(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    Price.main(pid, path)
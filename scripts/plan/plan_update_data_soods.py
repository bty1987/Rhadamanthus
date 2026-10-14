#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Price(Util):

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

        self.INSERT_TEMPORARY = """
            INSERT INTO data.soods (sid, selling, balance, cost, num, status)
            VALUES %s ON DUPLICATE KEY UPDATE selling = VALUES (selling), balance = VALUES (balance), cost = VALUES (cost), num = VALUES (num), status = VALUES (status);
        """

    def main(self, pid, path):

        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            lists = self.readFilesByline(filePath, 0)
            # lists = self.readFilesByline("E:/1231.xls", 0)

            lengths = len(lists)
            if lengths == 0:
                raise RuntimeError(u'The query result is zero!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            

            # 循环取Excel中的值 并将取出来的值 拼接成 insert语句
            # non = 0 首次拼接 不加,
            non = 0
            sqlstrs = []

            for i, v in enumerate(lists):

                try:

                    sid = int(v[0])
                    selling = int(float(v[1]) * 1000)
                    balance = int(float(v[2]) * 1000)
                    cost = int(float(v[3]) * 1000)
                    num = int(float(v[4]) * 1000)
                    status = int(v[5])

                    sqlstrs.append("(%s, %s, %s, %s, %s, %s)" % (str(sid), str(selling), str(balance), str(cost), str(num), str(status)))

                    non += 1

                    if non == 100:
                    
                        self.cursor.execute(self.INSERT_TEMPORARY % (','.join(sqlstrs)))
                        self.commit()

                        non = 0
                        sqlstrs = []

                        molecular = molecular + 1
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })
                except Exception as e:

                    e = "请检查该行内容,错误内容在第%s行。%s。" % (non, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.cursor.execute(self.INSERT_TEMPORARY % (','.join(sqlstrs)))
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
        在选材中创建批量更新计划,并上传批量更新的文件到文件服务器中,可从计划页面看出是否更新成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;
        
        脚本传参说明:
        python plan_update_data_soods.py pid path
        python plan_update_data_soods.py 540 group1/M00/16/42/wKgFZ1um8a6AXYN7AABMAFgoD7k093.xls         
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath,encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    # pid = 3686
    # path = "E:/1231.xls"

    price = Price(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    price.main(pid, path)

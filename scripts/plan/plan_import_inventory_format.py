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
        
        self.INSERT_INVENTORY_FORMAT = """
            INSERT INTO data.format (gid, info, status) VALUES %s
        """

        self.SELECT_INVENTORY_FID = """SELECT fid FROM data.format where gid=%s and info="%s";"""

    def main(self, pid, path):
    
        try:
        
            self.getDBCursor(self.host, self.username, self.password, self.charset)
            url = self.media + path
            filePath = self.downLoadFile(url, path)

            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise ValueError('The query result is zero!')

            all = lengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            res = []
            valus = """ (%s, "%s", %s) """

            for i, v in enumerate(list):
                try:
                
                    if self.paramCheck(r'^[1-9]\d*$', v[0]) == False:
                        raise ValueError('gid错误, gid应为非0正整数')

                    if self.paramCheck(r'^.{1,64}$', v[2]) == False:
                        raise ValueError('规格错误, 内容应在64字以内')

                    gid = int(v[0])
                    info = v[2]

                    res.append(valus % (gid, info, 0))

                    molecular = molecular + 1
                    schedules = (molecular / all) * 100

                    self.updataSchedule(self.pthost, pid, {
                        "plan.schedule": int(schedules),
                    })
                    
                    if (i % 200) == 0:
                        
                        self.importCommit(res, self.INSERT_INVENTORY_FORMAT)
                        
                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:
                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media,e, False)

            self.importCommit(res, self.INSERT_INVENTORY_FORMAT)

            self.delFile(filePath)

        except Exception as e:
        
            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)
        finally:
        
            self.modelEnd(pid, self.pthost, self.media,self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入规格脚本说明: 
        在商品中创建导入规格计划,并上传导入规格的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;
        
        脚本传参说明:
        python plan_import_inventory_format.py pid path
               plan_import_inventory_format.py 543 group1/M00/16/42/wKgFZ1um8zqAda4TAABMAH2CzUw818.xls
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    importer.main(pid, path)

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

        self.INSERT_AOODS_CHARGE = """
            INSERT INTO data.aoodscharge (aid, name, price, surplus, type, status, sort) VALUES %s;
        """

    def main(self, pid, path, aid):
    
        try:

            self.getDBCursor(self.host, self.username, self.password, self.charset)

            url = self.media + path
            filePath = self.downLoadFile(url, path)
            list = self.readFilesByline(filePath, 0)

            lengths = len(list)

            if lengths == 0:
                raise ValueError('The query result is zero!')

            # Subtract 1 for header row
            dataLengths = lengths - 1

            if dataLengths <= 0:
                raise ValueError('No data rows found (only header)!')

            all = dataLengths / 0.8
            molecular = all * 0.1
            schedule = (molecular / all) * 100

            self.updataSchedule(self.pthost, pid, {
                "plan.schedule": int(schedule),
                "plan.status": 4
            })

            res = []
            valus = "(%s, \"%s\", %s, %s, %s, %s, %s)"

            for i, v in enumerate(list):

                # Skip header row (first row)
                if i == 0:
                    continue

                try:

                    name = v[0]
                    if name.strip() == "":
                        continue

                    # price: yuan -> fen/厘 (multiply by 1000)
                    price = int(float(v[1]) * 1000)

                    # surplus: yuan -> fen/厘 (multiply by 1000)
                    surplus = int(float(v[2]) * 1000)

                    # type: 通用->0, 超阶->1
                    typeStr = str(v[3]).strip()
                    if typeStr == '超阶':
                        types = 1
                    else:
                        types = 0

                    # status: 启用->0, 禁用->1
                    statusStr = str(v[4]).strip()
                    if statusStr == '禁用':
                        status = 1
                    else:
                        status = 0

                    # sort
                    sort = int(float(v[5]))

                    data = (aid, name, price, surplus, types, status, sort)

                    res.append(valus % data)
                    
                    if (i % 200) == 0:
                    
                        self.importCommit(res, self.INSERT_AOODS_CHARGE)
                        
                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:
                
                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.importCommit(res, self.INSERT_AOODS_CHARGE)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入aoodsCharge费用脚本说明: 
        在aoodsCharge中创建导入费用计划,并上传导入费用的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;
        
        脚本传参说明:
        python plan_import_data_aoodscharge.py pid path aid
        python plan_import_data_aoodscharge.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 123
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    aid = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, int(aid))

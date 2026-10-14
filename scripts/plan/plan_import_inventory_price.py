#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *

class Importer(Util):

    def __init__(self, host='', username='', password='', media='', pthost='', charset='utf8'):
    
        self.dbconn = None

        self.host = host
        self.username = username
        self.password = password
        self.charset = charset
        self.media = media
        self.pthost = pthost

        self.flag = True
        
        self.INSERT_INVENTORY_PRICE = """
            INSERT INTO data.price(gid, name, type, purchase, selling, confine, ctype, cvalue) VALUES %s  
        """

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
            valus = """ (%s, "%s", %s, %s, %s, %s, %s, %s) """

            for i, v in enumerate(list):

                try:

                    if self.paramCheck('^[1-9]\d*$', str(int(v[0]))) == False:
                        raise ValueError('gid错误, gid应为非0正整数')

                    if self.paramCheck('^.{1,32}$', v[1]) == False:
                        raise ValueError('价格说明错误, 内容应在32字以内')

                    if self.paramCheck('^[01]$', str(int(v[2]))) == False:
                        raise ValueError('类型错误, 类型只能是0或者1')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[3]))) == False:
                        raise ValueError('进价错误, 进价应为除0外任意数小数点后最多3位')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[4]))) == False:
                        raise ValueError('售价错误, 售价应为除0外任意数小数点后最多3位')
                        
                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[5]))) == False:
                        raise ValueError('售价错误, 售价应为除0外任意数小数点后最多3位')

                    if self.paramCheck('^[01]$', str(int(v[6]))) == False:
                        raise ValueError('结算类型错误, 类型只能是0或者1')

                    if int(v[6]) == 1:
                        if self.paramCheck('^(0|0\.[0-9]{0,3})$', str(float(v[7]))) == False:
                            raise ValueError('结算值错误, 当类型为1时, 结算值应为0-1之间小数点后最多3位')
                    else:
                        if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})', str(float(v[7]))) == False:
                            raise ValueError('结算值错误, 当类型为0时, 任意数小数点后最多3位')

                    gid = int(v[0])
                    name = v[1]
                    type = int(v[2])
                    purchase = int(float(v[3])*1000)
                    selling = int(float(v[4])*1000)
                    confine = int(float(v[5])*1000)
                    ctype = int(v[6])
                    cvalue = int(float(v[7])*1000)

                    temp = (gid, name, type, purchase, selling, confine, ctype, cvalue)

                    res.append(valus % temp)
                    
                    if (i % 200) == 0:
                        
                        self.importCommit(res, self.INSERT_INVENTORY_PRICE)
                        
                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:
                    e = "请检查该行内容,错误内容在第%s行。%s。" % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)
                    
            self.importCommit(res,self.INSERT_INVENTORY_PRICE)

            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)
        finally:

            self.modelEnd(pid, self.pthost, self.media,self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
       导入价格脚本说明: 
       在商品中创建导入价格计划,并上传导入价格的文件到文件服务器中,可从计划页面看出是否导入成功;
       当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;
       
       脚本传参说明:
       python plan_import_inventory_price.py pid path
              plan_import_inventory_price.py 542 group1/M00/16/42/wKgFZ1um8vaAFdzJAABOAId-UH4635.xls
    """

    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    importer.main(pid, path)

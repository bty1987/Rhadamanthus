#!/usr/bin/python
# -*- coding:UTF-8 -*-

from plan_util import *
from pypinyin import *

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

        self.INSERT_INVENTORY_GOODS = """
            INSERT INTO data.goods (no, name, pinyin, barcode, category, bid, brand, measurementUnit, purchase, selling, confine, pieceNum, type, status, company) VALUES %s;
        """

    def getPinyinName(self, name):

        if name != None and name != "":
            pinyinName = "".join(lazy_pinyin('%s' % name))

            return pinyinName[:128]

        return ""

    def main(self, pid, path, company):
    
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
            valus = """ ("%s", "%s", "%s", "%s", "%s", %s, "%s", "%s", %s, %s, %s, %s, %s, %s, %s) """

            types = 0
            status = 0

            for i, v in enumerate(list):

                if v[0].strip() == "": continue

                try:

                    if self.paramCheck('^.{1,64}$', v[0]) == False:
                        raise ValueError('商品编号格式错误, 请输入64个以下字符')

                    if self.paramCheck('^.{1,64}$', v[1]) == False:
                        raise ValueError('商品名称格式错误, 请输入64个以下字符')

                    if self.paramCheck('^.{0,128}$', v[2]) == False:
                        raise ValueError('条形码格式错误, 请输入128个以下字符')

                    if self.paramCheck('^.{1,32}$', v[3]) == False:
                        raise ValueError('品类格式错误, 请输入32个以下字符')

                    if self.paramCheck('^[0-9]\d*$', str(int(v[4]))) == False:
                        raise ValueError('品牌ID格式错误, 请输入正整数')

                    if self.paramCheck('^.{1,32}$', v[5]) == False:
                        raise ValueError('品牌格式错误, 请输入32个以下字符')

                    if self.paramCheck('^.{1,10}$', v[6]) == False:
                        raise ValueError('单位格式错误, 请输入10个以下字符')
                    
                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[7]))) == False:
                        raise ValueError('控价格式错误, 请输入小数格式')
                        
                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[8]))) == False:
                        raise ValueError('售价格式错误, 请输入小数格式')
                        
                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[9]))) == False:
                        raise ValueError('限价格式错误, 请输入小数格式')

                    if self.paramCheck('^(\d*|\d+\.[0-9]{1,3})$', str(float(v[10]))) == False:
                        raise ValueError('数量格式错误, 请输入小数格式')

                    no = v[0]
                    name = v[1]
                    pinyinName = self.getPinyinName(name)
                    barcode = v[2]
                    category = v[3]
                    bid = int(v[4])
                    brand = v[5]
                    measurementUnit = v[6]
                    purchase = int(float(v[7])*1000)
                    selling = int(float(v[8])*1000)
                    confine = int(float(v[9])*1000)
                    pieceNum = int(float(v[10])*1000)

                    data = (no, name, pinyinName[0:128], barcode, category, bid, brand, measurementUnit, purchase, selling, confine, pieceNum, types, status ,company)

                    res.append(valus % data)
                    
                    if (i % 200) == 0:
                    
                        self.importCommit(res, self.INSERT_INVENTORY_GOODS)
                        
                        res = []

                        molecular = molecular + 200
                        schedules = (molecular / all) * 100

                        self.updataSchedule(self.pthost, pid, {
                            "plan.schedule": int(schedules),
                        })

                except Exception as e:
                
                    e = "请检查该行内容, 错误内容在第%s行. %s. " % (i + 1, e)
                    self.errCall(pid, self.pthost, self.media, e, False)

            self.importCommit(res, self.INSERT_INVENTORY_GOODS)
            self.delFile(filePath)

        except Exception as e:

            self.flag = False
            self.errCall(pid, self.pthost, self.media, e)

        finally:

            self.modelEnd(pid, self.pthost, self.media, self.flag)
            sys.exit(0)

if __name__ == '__main__':

    """
        导入商品脚本说明: 
        在商品中创建导入商品计划,并上传导入商品的文件到文件服务器中,可从计划页面看出是否导入成功;
        当该脚本执行出现异常时,不影响进度并跳过错误的数据,然后记录文件中第几条数据有异常,并写到log文件中上传至文件服务器中;
        
        脚本传参说明:
        python plan_import_inventory_goods.py pid path
        python plan_import_inventory_goods.py 540 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 
        测试用文件 group1/M00/1C/0C/wKgFZ1wUjaeAPTogAABKAOy3d7E247.xls 正确
        测试用文件 group1/M00/1C/0C/wKgFZ1wUjhGAEtbLAABMADqpIBU664.xls 错误
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]
    company = sys.argv[3]

    importer = Importer(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"), config.get("pthost"))
    importer.main(pid, path, int(company))

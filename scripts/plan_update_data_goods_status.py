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

        self.CREATE_GOODS_TEMP = """CREATE TABLE tempbase.tmpg(gid INT(11), status TINYINT(1))"""
        self.REPLACE_GOODS_TEMP = """REPLACE INTO tempbase.tmpg (gid, status) VALUES %s""" # 每100条执行一次
        self.UPDATE_GOODS_STATUS = """UPDATE tempbase.goods g, tempbase.tmpg t SET g.status = t.status WHERE g.gid = t.gid"""
        self.DROP_GOODS_TEMP = """DROP TABLE tempbase.tmpg"""

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

            self.cursor.execute(self.CREATE_GOODS_TEMP) # 创建临时表
            self.commit()

            for i, v in enumerate(lists):
            
                try:
                
                    if self.paramCheck(r'^[0-9]\d*$', str(int(v[0]))) == False:
                        raise ValueError('商品ID格式错误,请输入正整数')
                        
                    if self.paramCheck(r'^[01]{1}$', str(int(v[2]))) == False:
                        raise ValueError('商品状态格式错误,请输入0(启用)/1(禁用)')

                    list.append("(%s, %s)" % (int(v[0]), int(v[2])))

                    if (i % self.limit) == 0:
                    
                        sql = self.REPLACE_GOODS_TEMP % (','.join(list))
                        
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
            
                sql = self.REPLACE_GOODS_TEMP % (','.join(list))
                
                self.cursor.execute(sql)
                self.commit()

            self.cursor.execute(self.UPDATE_GOODS_STATUS) # 更新商品状态
            self.commit()
            
            self.cursor.execute(self.DROP_GOODS_TEMP)  # 删除临时表
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
        创建批量更新商品状态计划, 并上传批量更新的文件到文件服务器中, 可从计划页面看出是否更新成功;
        当该脚本执行出现异常时, 不影响进度并跳过错误的数据, 然后记录文件中第几条数据有异常, 并写到log文件中上传至文件服务器中;
        
        脚本传参说明:
        python plan_update_data_goods.py pid path
        python plan_update_data_goods.py 540 group5/M00/28/73/wKgFbGZF6jiAT13NAABKAAb0tC8757.xls         
    """
    
    modernFilePath = os.path.realpath(__file__)
    configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

    config = json.load(open(configPath, encoding="utf-8"))
    dbconf = config.get("database")

    pid = sys.argv[1]
    path = sys.argv[2]

    updater = Updater(dbconf.get("host"), dbconf.get("username"), dbconf.get("password"), config.get("media"),config.get("pthost"))
    updater.main(pid, path)

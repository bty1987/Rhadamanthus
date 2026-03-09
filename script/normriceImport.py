#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

import xlrd

def open_excel(filePath):
    data = xlrd.open_workbook(filePath)
    try:
        data = xlrd.open_workbook(filePath)
        return data
    except Exception as exce:
        print(str(exce))

if __name__ == "__main__":
    
    data = open_excel('normrice.xls')
    table = data.sheet_by_name(u"Sheet1")
    rowNum = table.nrows
    
    output = []
    
    _gid = 0
    _purchase = 0
    _selling = 0
    
    for num in range(0, rowNum):
        
        row = table.row_values(num)
        
        qiid = row[0]
        cnid = row[1]
        unit = row[2]
        trannum = int(float(row[3] and row[3] or 0)*1000)
        salary = int(float(row[4] and row[4] or 0)*1000)
        stuff = int(float(row[5] and row[5] or 0)*1000)
        
        output.append("(%s, %s, '%s', %s, %s, %s, 0)" % (qiid, cnid, unit, trannum, salary, stuff))
        
#    print(','.join(output))

    no = 'QV_160'

    print("set @qvid = (select qvid from quotation.quotationversion where no = '%s');" % (no))
    print()
    
    print("drop temporary table tmp;")
    print("create temporary table tmp(npid int(11));")
    print("insert into tmp (npid) select np.npid from quotation.quotationitem qi, data.normrice np where qi.qvid = @qvid and qi.qiid = np.qiid;")
    print("update data.normrice np, tmp t set status = 2 where np.npid = t.npid;")
    print("delete from data.normrice where status = 2;")
    
    print()
    
    print('insert into data.normrice (qiid, cnid, unit, trannum, salary, stuff, status) values %s;' % ','.join(output))
    print()
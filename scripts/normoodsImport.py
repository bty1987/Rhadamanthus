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
    
    data = open_excel('normoods.xls')
    table = data.sheet_by_name(u"Sheet1")
    rowNum = table.nrows
    
    output = []
    
    _gid = 0
    _purchase = 0
    _selling = 0
    
    for num in range(0, rowNum):
        
        row = table.row_values(num)
        
        name = row[0]
        qiid = row[1]
        nid = row[2]
        normunit = row[3]
        normnum = int(float(row[4])*1000)
        storeunit = row[5]
        storenum = int(float(row[6])*1000)
        price = int(float(row[7])*1000)
        
        output.append("('%s', %s, '%s', %s, '%s', %s, %s, %s, 0)" % (name, qiid, normunit, normnum, storeunit, storenum, nid, price))
        
#    print(','.join(output))

    no = 'QV_160'
    
    print("set @qvid = (select qvid from quotation.quotationversion where no = '%s');" % (no))
    print()
    
    print("drop temporary table tmp;")
    print("create temporary table tmp(ngid int(11));")
    print("insert into tmp (ngid) select ng.ngid from quotation.quotationitem qi, data.normood ng where qi.qvid = @qvid and qi.qiid = ng.qiid;")
    print("update data.normood ng, tmp t set status = 2 where ng.ngid = t.ngid;")
    print("delete from data.normood where status = 2;")
    print()
    
    print('insert into data.normood (name, qiid, normunit, normnum, storeunit, storenum, nid, price, status) values %s;' % ','.join(output))
    print()
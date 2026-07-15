#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

import os.path

path = "E:\\Ali\\Athena\\"
workspace = "E:\\Workspaces\\Rhadamanthus\\"
testenv = "E:\\Svn\\TI\\"

infos = [
    {"source": "01.Decoration\\Foreground\\js\\decoration\\", "target": "99.Foreground\\js\\decoration\\", "workspace": "WebContent\\js\\decoration\\"},
    {"source": "01.Decoration\\Foreground\\views\\decoration\\", "target": "99.Foreground\\views\\decoration\\", "workspace": "WebContent\\views\\decoration\\"},
    {"source": "01.Decoration\\Foreground\\js\\contract\\", "target": "99.Foreground\\js\\contract", "workspace": "WebContent\\js\\contract\\"},
    {"source": "01.Decoration\\Foreground\\views\\contract\\", "target": "99.Foreground\\views\\contract\\", "workspace": "WebContent\\views\\contract\\"},
    {"source": "01.Decoration\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api"},
    {"source": "01.Decoration\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "01.Decoration\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\"},
    {"source": "01.Decoration\\Background\\decoration\\", "target": "src\\com\\fanglin\\decoration\\"},
    
    {"source": "02.Material\\Foreground\\js\\material\\", "target": "99.Foreground\\js\\material\\", "workspace": "WebContent\\js\\material\\"},
    {"source": "02.Material\\Foreground\\views\\material\\", "target": "99.Foreground\\views\\material\\", "workspace": "WebContent\\views\\material\\"},
    {"source": "02.Material\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\"},
    {"source": "02.Material\\Background\\material\\", "target": "src\\com\\fanglin\\material\\"},
    
    {"source": "03.Quotation\\Foreground\\js\\quotation\\", "target": "99.Foreground\\js\\quotation\\", "workspace": "WebContent\\js\\quotation\\"},
    {"source": "03.Quotation\\Foreground\\views\\quotation\\", "target": "99.Foreground\\views\\quotation\\", "workspace": "WebContent\\views\\quotation\\"},
    {"source": "03.Quotation\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api"},
    {"source": "03.Quotation\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "03.Quotation\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\"},
    {"source": "03.Quotation\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "03.Quotation\\Background\\quotation\\", "target": "src\\com\\fanglin\\quotation\\"},
    
    {"source": "04.Construction\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "04.Construction\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "04.Construction\\Foreground\\js\\construction\\", "target": "99.Foreground\\js\\construction\\", "workspace": "WebContent\\js\\construction\\"},
    {"source": "04.Construction\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "04.Construction\\Foreground\\views\\", "target": "99.Foreground\\views\\construction\\", "workspace": "WebContent\\views\\construction\\"},
    {"source": "04.Construction\\Background\\construction\\", "target": "src\\com\\fanglin\\construction\\"},
    
    {"source": "05.Information\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "05.Information\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "05.Information\\Foreground\\js\\information\\", "target": "99.Foreground\\js\\information\\", "workspace": "WebContent\\js\\information\\"},
    {"source": "05.Information\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "05.Information\\Foreground\\views", "target": "99.Foreground\\views\\information", "workspace": "WebContent\\views\\information"},
    {"source": "05.Information\\Background\\", "target": "src\\com\\fanglin\\information\\"},
    
#    {"source": "06.Department\\Foreground\\js", "target": "99.Foreground\\js\\department", "workspace": "WebContent\\js\\department"},
#    {"source": "06.Department\\Foreground\\views", "target": "99.Foreground\\views\\department", "workspace": "WebContent\\views\\department"},
#    {"source": "06.Department\\Background\\", "target": "src\\com\\fanglin\\department\\"},

    {"source": "07.Data\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "07.Data\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition", "workspace": "WebContent\\js\\condition\\"},
    {"source": "07.Data\\Foreground\\js\\data", "target": "99.Foreground\\js\\data\\", "workspace": "WebContent\\js\\data\\"},
    {"source": "07.Data\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "07.Data\\Foreground\\views\\", "target": "99.Foreground\\views\\data", "workspace": "WebContent\\views\\data\\"},
    {"source": "07.Data\\Background\\data\\", "target": "src\\com\\fanglin\\data\\"},
    
    {"source": "08.Inventory\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "08.Inventory\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "08.Inventory\\Foreground\\js\\manifest\\", "target": "99.Foreground\\js\\manifest\\", "workspace": "WebContent\\js\\manifest\\"},
    {"source": "08.Inventory\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "08.Inventory\\Foreground\\views\\manifest\\", "target": "99.Foreground\\views\\manifest\\", "workspace": "WebContent\\views\\manifest\\"},
    {"source": "08.Inventory\\Background\\", "target": "src\\com\\fanglin\\inventory\\"},
    
    {"source": "09.Approval\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "09.Approval\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "09.Approval\\Foreground\\js\\approval\\", "target": "99.Foreground\\js\\approval\\", "workspace": "WebContent\\js\\approval\\"},
    {"source": "09.Approval\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\"},
    {"source": "09.Approval\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "09.Approval\\Foreground\\views\\", "target": "99.Foreground\\views\\approval\\", "workspace": "WebContent\\views\\approval\\"},
    {"source": "09.Approval\\Background\\", "target": "src\\com\\fanglin\\approval\\"},
    
    {"source": "10.Salary\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "10.Salary\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "10.Salary\\Foreground\\js\\salary\\", "target": "99.Foreground\\js\\salary\\", "workspace": "WebContent\\js\\salary\\"},
    {"source": "10.Salary\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "10.Salary\\Foreground\\views\\", "target": "99.Foreground\\views\\salary\\", "workspace": "WebContent\\views\\salary\\"},
    {"source": "10.Salary\\Background\\salary\\", "target": "src\\com\\fanglin\\salary\\"},
    
    {"source": "11.Payment\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "11.Payment\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "11.Payment\\Foreground\\js\\payment\\", "target": "99.Foreground\\js\\payment\\", "workspace": "WebContent\\js\\payment\\"},
    {"source": "11.Payment\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\"},
    {"source": "11.Payment\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "11.Payment\\Foreground\\views\\payment\\", "target": "99.Foreground\\views\\payment\\", "workspace": "WebContent\\views\\payment\\"},
    {"source": "11.Payment\\Background\\payment\\", "target": "src\\com\\fanglin\\payment\\"},
    
    {"source": "12.Personnel\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "12.Personnel\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "12.Personnel\Foreground\\js\\personel\\", "target": "99.Foreground\\js\\personnel\\", "workspace": "WebContent\\js\\personnel\\"},
    {"source": "12.Personnel\\Foreground\\js\\contract\\", "target": "99.Foreground\\js\\contract", "workspace": "WebContent\\js\\contract\\"},
    {"source": "12.Personnel\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils\\"},
    {"source": "12.Personnel\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "12.Personnel\\Foreground\\views\\personel\\", "target": "99.Foreground\\views\\personnel", "workspace": "WebContent\\views\\personnel"},
    {"source": "12.Personnel\\Foreground\\views\\contract\\", "target": "99.Foreground\\views\\contract\\", "workspace": "WebContent\\views\\contract\\"},
    {"source": "12.Personnel\\Background\\personel\\", "target": "src\\com\\fanglin\\personel\\"},
    
    {"source": "13.Finance\\Background\\finance", "target": "src\\com\\fanglin\\finance\\"},
    
    {"source": "14.DingDing\\Background\\", "target": "src\\com\\fanglin\\dingding\\"},
    
    {"source": "15.Right\\Background\\", "target": "src\\com\\fanglin\\right\\"},
    
    {"source": "16.Production\\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "16.Production\\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "16.Production\\Foreground\\js\\production\\", "target": "99.Foreground\\js\\production\\", "workspace": "WebContent\\js\\production\\"},
    {"source": "16.Production\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils", "workspace": "WebContent\\js\\utils"},
    {"source": "16.Production\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "16.Production\\Foreground\\views\\", "target": "99.Foreground\\views\\production\\", "workspace": "WebContent\\views\\production\\"},
    {"source": "16.Production\\Background\\", "target": "src\\com\\fanglin\\production\\"},
    
    {"source": "17.Import\\Background\\", "target": "src\\com\\fanglin\\imports\\"},
    
    {"source": "18.Export\\Background\\", "target": "src\\com\\fanglin\\exports\\"},
    
    {"source": "19.System\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "19.System\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "19.System\Foreground\\js\\system\\", "target": "99.Foreground\\js\\system\\", "workspace": "WebContent\\js\\system\\"},
    {"source": "19.System\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "19.System\\Foreground\\views\\", "target": "99.Foreground\\views\\system", "workspace": "WebContent\\views\\system\\"},
    {"source": "19.System\\Background\\", "target": "src\\com\\fanglin\\system\\"},
    
    {"source": "20.Building\Foreground\\js\\building\\", "target": "99.Foreground\\js\\building", "workspace": "WebContent\\js\\building\\"},
    {"source": "20.Building\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api", "workspace": "WebContent\\js\\api\\"},
    {"source": "20.Building\Foreground\\js\\condition", "target": "99.Foreground\\js\\condition", "workspace": "WebContent\\js\\condition\\"},
    {"source": "20.Building\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "20.Building\\Foreground\\views\\building", "target": "99.Foreground\\views\\building", "workspace": "WebContent\\views\\building"},
    {"source": "20.Building\\Background\\building", "target": "src\\com\\fanglin\\building\\"},
    
    {"source": "21.Sales\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "21.Sales\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "21.Sales\Foreground\\js\\sales\\", "target": "99.Foreground\\js\\sales\\", "workspace": "WebContent\\js\\sales\\"},
    {"source": "21.Sales\\Foreground\\js\\utils\\", "target": "99.Foreground\\js\\utils\\", "workspace": "WebContent\\js\\utils\\"},
    {"source": "21.Sales\\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "21.Sales\\Foreground\\views\\sales\\", "target": "99.Foreground\\views\\sales", "workspace": "WebContent\\views\\sales\\"},
    {"source": "21.Sales\\Background\\", "target": "src\\com\\fanglin\\sales\\"},
    
    {"source": "22.Report\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "22.Report\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "22.Report\Foreground\\js\\report\\", "target": "99.Foreground\\js\\report\\", "workspace": "WebContent\\js\\report\\"},
    {"source": "22.Report\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "22.Report\\Foreground\\views\\", "target": "99.Foreground\\views\\report\\", "workspace": "WebContent\\views\\report\\"},
    {"source": "22.Report\\Background\\", "target": "src\\com\\fanglin\\report\\"},
    
    {"source": "23.Communion\\Background\\communion\\", "target": "src\\com\\fanglin\\communion\\"},
    
    {"source": "24.Store\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "24.Store\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "24.Store\Foreground\\js\\store\\", "target": "99.Foreground\\js\\store\\", "workspace": "WebContent\\js\\store\\"},
    {"source": "24.Store\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "24.Store\\Foreground\\views\\store\\", "target": "99.Foreground\\views\\store\\", "workspace": "WebContent\\views\\store\\"},
    {"source": "24.Store\\Background\\store\\", "target": "src\\com\\fanglin\\store\\"},
    
    {"source": "25.Customer\Foreground\\js\\customer\\", "target": "99.Foreground\\js\\customer\\", "workspace": "WebContent\\js\\customer\\"},
    {"source": "25.Customer\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "25.Customer\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "25.Customer\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "25.Customer\\Foreground\\views\\customer\\", "target": "99.Foreground\\views\\customer\\", "workspace": "WebContent\\views\\customer\\"},
    {"source": "25.Customer\\Background\\", "target": "src\\com\\fanglin\\customer\\"},
    
    {"source": "26.Market\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "26.Market\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "26.Market\Foreground\\js\\market", "target": "99.Foreground\\js\\market", "workspace": "WebContent\\js\\market"},
    {"source": "26.Market\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "26.Market\\Foreground\\views\\market", "target": "99.Foreground\\views\\market", "workspace": "WebContent\\views\\market"},
    {"source": "26.Market\\Background\\market", "target": "src\\com\\fanglin\\market\\"},
    
    {"source": "27.Balance\Foreground\\js\\balance\\", "target": "99.Foreground\\js\\balance\\", "workspace": "WebContent\\js\\balance\\"},
    {"source": "27.Balance\Foreground\\js\\api\\", "target": "99.Foreground\\js\\api\\", "workspace": "WebContent\\js\\api\\"},
    {"source": "27.Balance\Foreground\\js\\condition\\", "target": "99.Foreground\\js\\condition\\", "workspace": "WebContent\\js\\condition\\"},
    {"source": "27.Balance\Foreground\\ds\\", "target": "99.Foreground\\ds\\", "workspace": "WebContent\\ds\\"},
    {"source": "27.Balance\\Foreground\\views\\balance\\", "target": "99.Foreground\\views\\balance\\", "workspace": "WebContent\\views\\balance\\"},
    {"source": "27.Balance\\Background\\balance\\", "target": "src\\com\\fanglin\\balance\\"},
    
    {"source": "28.Fadada\\Background\\fadada\\", "target": "src\\com\\fanglin\\fadada\\"},
    {"source": "29.Yinsheng\\Background\\yspay\\", "target": "src\\com\\fanglin\\yspay\\"},
    {"source": "30.Kingdee\\Background\\kingdee\\", "target": "src\\com\\fanglin\\kingdee\\"},
    {"source": "31.Postar\\Background\\", "target": "src\\com\\fanglin\\postar\\"},
    {"source": "32.Wechat\\Background\\", "target": "src\\com\\fanglin\\wechat\\"},
    {"source": "33.Seiya\\Background\\", "target": "src\\com\\fanglin\\seiya\\"},
    {"source": "34.Aliyun\\Background\\", "target": "src\\com\\fanglin\\aliyun\\"},
    {"source": "35.Elecsign\\Background\\", "target": "src\\com\\fanglin\\elecsign\\"},
    
    {"source": "99.Foreground\\js\\api\\", "target": "WebContent\\js\\api\\"},
    {"source": "99.Foreground\\js\\com\\", "target": "WebContent\\js\\com\\"},
    {"source": "99.Foreground\\js\\condition\\", "target": "WebContent\\js\\condition\\"},
    {"source": "99.Foreground\\js\\utils\\", "target": "WebContent\\js\\utils\\"},
    {"source": "99.Foreground\\ds", "target": "WebContent\\ds"},
    
    {"source": "97.Database", "target": "dbs\\"},
 ]

def copyFiles(sourceDir,  targetDir):
    if sourceDir.find(".svn") > 0:
        return
    for _file in os.listdir(sourceDir):
        sourceFile = os.path.join(sourceDir,  _file)
        targetFile = os.path.join(targetDir,  _file)
        
        if os.path.isfile(sourceFile):
            if not os.path.exists(targetDir):
                os.makedirs(targetDir)
            if not os.path.exists(targetFile) or(os.path.exists(targetFile) and (os.path.getmtime(targetFile) != os.path.getmtime(sourceFile))):
                open(targetFile, "wb").write(open(sourceFile, "rb").read())
        if os.path.isdir(sourceFile):
#            First_Directory = False
            copyFiles(sourceFile, targetFile)
            
def coverFiles(sourceDir,  targetDir):
    for _file in os.listdir(sourceDir):
        sourceFile = os.path.join(sourceDir,  _file)
        targetFile = os.path.join(targetDir,  _file)
        #cover the files
        if os.path.isfile(sourceFile):
            open(targetFile, "wb").write(open(sourceFile, "rb").read())
            
def merge():
    
    for info in infos:
        
        if info.get("workspace") != None:
            copyFiles(path + info.get("source"), path + info.get("target"))
            copyFiles(path + info.get("source"), workspace + info.get("workspace"))
            copyFiles(path + info.get("source"), testenv + info.get("workspace").replace("WebContent\\", ""))
        else:
            copyFiles(path + info.get("source"), workspace + info.get("target"))

def issue():
    for info in infos:
        
        if info.get("workspace") != None:
            copyFiles(workspace + info.get("workspace"), path + info.get("source"))
            copyFiles(workspace + info.get("workspace"), path + info.get("target"))
        else:
            copyFiles(workspace + info.get("target"), path + info.get("source"))
        
if __name__ == '__main__':
    
    merge()
#    issue()
    pass
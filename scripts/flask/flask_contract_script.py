#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

import json
import requests
import pdfkit
import os
import calendar
import time

from flask import render_template_string

class contract():
    
    def receipt(self, args, logger, redis, mongo):

        wkthmltopdf_path = "/usr/local/bin/wkhtmltopdf"
        config = pdfkit.configuration(wkhtmltopdf=wkthmltopdf_path)

        receiptData = json.loads(args["receipt"])

        pdfname = "%s.pdf" % calendar.timegm(time.gmtime())
        pdfpath = "%s/%s" % ("/tmp/pdf/", pdfname)  # 转换生成pdf文档的位置

        # READ HTML FILE FROM args

        host = json.load(open("%s/%s" % (os.getcwd(), "config.json"))).get("pthost")

        content = requests.get("%s%s" % (host, receiptData["path"]))

        page = render_template_string(content.text, receipt=receiptData)

        pdfkit.from_string(page, pdfpath, configuration=config)

        # UPLOAD PDF FILE

        files = {'strutsUploads': ('.pdf', open(pdfpath, 'rb'), {'name': 'strutsUploads'})}

        url = "%s%s" % (host, "/uploadOther.do")

        ret = requests.post(url, data={}, files=files)

        res = json.loads(ret.text)

        # DELETE TEMP FILE

        os.remove(pdfpath)

        # RESPONSE WITH ERROR OR SUCCESS

        if not res:
            return {"code": -1, "msg": "REQUEST ERROR"}

        if res and res.get("errorCode") != 0:
            return {"code": res.get("errorCode"), "msg": res.get("errorMsg")}

        return {"code": 0, "msg": "", "resUrl": res.get("resUrl", "")}

#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

import base64
import hashlib
import hmac
import json
import os
import requests
import sys
import time

class fx():
    
    def __init__(self, logger=False):
        
        self.logger = logger
        
    def printf(self, *args):
        if self.logger: print(args)
    
    def card(self, args, logger, redis, mongo):
        
        #logger.info(args)
        
        logger.info("card")

        logger.info(args.get("baity", ""))
        logger.info(args.get("type"))

        ret = self._accessToken_()
        
        res = self._card(args.get("baity"), args.get("type"), ret.get("corpId"), ret.get("corpAccessToken"))
        
        return res
        
    def car(self, args, logger, redis, mongo):
        
        logger.info("car")
        
        res = self._car(args.get("cn", ""))
        
        print(json.dumps(res)[:100])
        
        return res

    def person(self, args, logger, redis, mongo):
        
        logger.info("person")
        logger.info(args)
        
#        res = self._person(args["name"], args["ident"], args["phone"])
        print("python3.7 /home/fenxiang/crontab/flask_fx_script.py %s %s %s %s %s &" % (args["baity"], args["name"], args["ident"], args["phone"], args["type"]))
        res = os.system("python3.7 /home/fenxiang/crontab/flask_fx_script.py %s %s %s %s %s &" % (args["baity"], args["name"], args["ident"], args["phone"], args["type"]))
        
        print(res)

        return {"errorCode": 0, "errorMsg": ""}
    
    def behead(self, args, logger, redis, mongo):
        
        logger.info("person")
        logger.info(args)
        
        res = os.system(args.get("cmd"))
        
        print(res)

        return {"errorCode": 0, "errorMsg": ""}

    def _card(self, objid, type, corpid, token):
        
        types = {
            "1": {
                "obj": "object_xbm0k__c",
                "file": "field_fs9ik__c",
                "name": "name",
                "ident": "field_JxT1F__c"
            },
            "2": {
                "obj": "object_ijZGa__c",
                "file": "field_lOa5u__c",
                "name": "name",
                "ident": "field_wg0BL__c"
            },
            "3": {
                "obj": "object_xbfWt__c",
                "file": "field_5a3uk__c",
                "name": "name",
                "ident": "field_klt1q__c"
            }
        }
        
        headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        
        params = {
            "corpId": corpid,
            "corpAccessToken": token,
            "currentOpenUserId": "FSUID_2FF4F44A77B22D538277188AE62DA8E8",
            "data": {
                "dataObjectApiName": types.get(type).get("obj"),
                "objectDataId": objid
            }
        }

        self.printf(params)
    
        ret = requests.post("https://open.fxiaoke.com/cgi/crm/custom/v2/data/get", data=json.dumps(params), headers=headers)

        self.printf(ret)
        
        obj = json.loads(ret.text);

        self.printf(obj)
        
        mediaId = obj.get("data").get(types.get(type).get("file"))[0].get("path")
        
        params = {
            "corpId": corpid,
            "corpAccessToken": token,
            "mediaId": mediaId
        }
        
        file = requests.post("https://open.fxiaoke.com/media/download", data=json.dumps(params), headers=headers)
        
        key = "5hMgqIlNLenKxqbI715OGX2P"
        secret = "XPPw238uvYFFRkExaQxsBqrHIOGSBmHB"
        
        url = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=%s&client_secret=%s" % (key, secret)
        
        res = requests.get(url)
        
        self.printf(res.json())
        
        url = "https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=%s" % res.json()["access_token"]
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        params = {
            "image": base64.b64encode(file.content),
            "id_card_side": "front",
        }
        
        res = requests.post(url, data=params, headers=headers)
        
        if not res:
            return {"errorCode":"11","msg":"身份证信息提取失败"}
        
        ret = res.json()
        
        if ret.get("error_code") and ret.get("error_code") != 0:
            return {"errorCode":"12","msg":"身份证信息提取失败, %s" % ret.get("error_msg")}
        
        if ret.get("image_status") in ["non_idcard", "unknown"]:
            return {"errorCode":"13","msg":"非身份证图片"}
        
        person = ret.get("words_result", {})
        
        self.printf(person)

        params = {
            "corpId": corpid,
            "corpAccessToken": token,
            "currentOpenUserId": "FSUID_2FF4F44A77B22D538277188AE62DA8E8",
            "data": {
                "object_data": {
                    "_id": objid,
                    "dataObjectApiName": types.get(type).get("obj"),
                }
            }
        }
        
        params.get("data").get("object_data")[types.get(type).get("name")] = person.get(u"姓名", "").get(u"words", "")
        params.get("data").get("object_data")[types.get(type).get("ident")] = person.get(u"公民身份号码", "").get(u"words", "")
        
        print(params)
        
        res = requests.post("https://open.fxiaoke.com/cgi/crm/custom/v2/data/update", data=json.dumps(params), headers=headers)
        print(res.text)
        
        return {"errorCode": 0, "msg": "", "name": person.get(u"姓名", "").get(u"words", ""), "ident": person.get(u"公民身份号码", "").get(u"words", "")}
        
    def _ccar(self, name, phone):
        
        key = "1614842641"
        secret = "79fc2723c5bb41b497f202967d36a139"
        
        timestamp = round(time.time())
        
        params = "app_key=%s&photos[0][url]=&submit_mobile=%s&submit_name=%s&timestamp=%s&key=%s" % (key, phone, name, timestamp, secret)
        
        print("Sign content:", params)
        
        mmd = hashlib.md5()
        mmd.update(params.encode("utf-8"))
        sign = mmd.hexdigest().lower()
        
        print("Sign content:", params)
        print("Sign sign:", sign)
        
        params = {
            "app_key": key,
            "timestamp": timestamp,
            "submit_name": name,
            "submit_mobile": phone,
            "photos[0][url]": "",
            "sign": sign
        }
        
        code = '{"app_key":"%s","timestamp":"%s","submit_name":"%s","submit_mobile":"%s","photos[0][url]":"","sign":"%s"}' % (key, timestamp, name, phone, sign)
        
#        url = "http://39.155.165.2:29000//cooperation/car-assess/save?app_key=%s&timestamp=%s&submit_name=%s&submit_mobile=%s&photos[0][url]=&sign=%s" % (key, timestamp, name, phone, sign)
#        url = "http://39.155.165.2:29000//cooperation/car-assess/save?sign=%s" % (sign)
        url = "http://39.155.165.2:29000//cooperation/car-assess/save"
        
        print(url)
        print(params)
        print(code)
        
        res = requests.post(url, data=params)
        
        if not res:
            return {"errorCode":"31","msg":"车辆评估信息获取失败"}
        
        ret = res.json()
        
        print(ret)
    
    def _car(self, cn):
        
        key = "1614842641"
        secret = "79fc2723c5bb41b497f202967d36a139"
        
        timestamp = round(time.time())
        
        params = "app_key=%s&car_sn=%s&timestamp=%s&key=%s" % (key, cn, timestamp, secret)
        
        print("Sign content:", params)
        
        mmd = hashlib.md5()
        mmd.update(params.encode("utf-8"))
        sign = mmd.hexdigest().lower()
        
        print("Sign content:", params)
        print("Sign sign:", sign)
        
        url = "http://39.155.165.2:29000/cooperation/car-assess/detail?app_key=%s&timestamp=%s&car_sn=%s&sign=%s" % (key, timestamp, cn, sign)
        
        print(url)
        
        res = requests.get(url)
        
        if not res:
            return {"errorCode":"31","msg":"车辆评估信息获取失败"}
        
        ret = res.json()
        
        print(ret)
        
        if ret.get("code", None) and ret.get("code") != 0:
            return {"errorCode":"32","msg":"车辆评估信息获取失败, %s" % ret.get("info", "")}
        
        return {"errorCode": 0, "msg": "", "pdf": ret.get("data", {}).get("car", {}).get("report_pdf")}
        
    def _person(self, name, ident, phone):
        
        key = "3864f1fb68384a08b5d6a8cbabf08b75"
        secret = "7571b93a61fd4e25b0ef9e2d245c7917"
        
        url = "http://oapi.fhldtech.com/person-risk/v1/comprehensive-assessment"
        
        code = '{"phoneNumber":"%s","name":"%s","idNumber":"%s"}' % (phone, name, ident)
        
        signature = self._hmac_sha1_(secret, code)
        
        print(signature)
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0)",
            "Content-Type": "application/json; charset=utf-8",
            "x-fhld-access-key-id": key,
            "x-fhld-signature": signature
        }
        
        res = requests.post(url, data=code.encode("utf-8"), headers=headers)
        
        if not res:
            return {"errorCode":"21","msg":"个人评估信息获取失败"}
        
        print(res.json())
        ret= res.json()
        
        if ret.get("code") and ret.get("code") != "200":
            return {"errorCode":"22","msg":"个人评估信息获取失败,%s" % ret.get("msg")}
         
        _id = ret.get("body", {}).get("id")
        
        url = "http://oapi.fhldtech.com/report-export/v1/pdf"
        
        code = '{"id":"%s"}' % _id
        
        signature = self._hmac_sha1_(secret, code)
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0)",
            "Content-Type": "application/json; charset=utf-8",
            "x-fhld-access-key-id": key,
            "x-fhld-signature": signature
        }
        
        print(code)
        print(signature)
        
        res = requests.post(url, data=code.encode("utf-8"), headers=headers)
        
        print(json.dumps(res.json())[:100])
        
        if not res:
            return {"errorCode":"23","msg":"个人评估文件获取失败"}
        
        ret= res.json()
        
        if ret.get("code") and ret.get("code") != "200":
            return {"errorCode":"24","msg":"个人评估文件获取失败,%s" % res.get("msg")}
        
        return {"errorCode": 0, "msg": "", "pdf": ret.get("body", {}).get("fileStr")}
    
    def _hmac_sha1_(self, secret, data):
        
        #生成签名
#        hashing = hmac.new(bytes(secret, encoding='utf-8'), bytes(json.dumps(data), encoding='utf-8'), hashlib.sha1).hexdigest()
        
#        return base64.b64encode(hashing.encode("utf-8")).decode()
        
        hmac_code = hmac.new(secret.encode("utf-8"), data.encode("utf-8"), hashlib.sha1).digest()
        
        # {"phoneNumber":"13854585","name":"白添宇","idNumber":"2101061952"}
#        
        return base64.b64encode(hmac_code).decode()
    
    def _accessToken_(self):
        
        appid = "FSAID_1319969"
        secret = "5b63714cc37a4cabb043ccbd66ec09c1"
        permanent = "40FBAA8ED3F94883B7A91558CCE5D6B9"
        
        url = "https://open.fxiaoke.com/cgi/corpAccessToken/get/V2"
        
        headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        
        params = {
            "appId": appid,
            "appSecret": secret,
            "permanentCode": permanent
        }
        
        res = requests.post(url, data=json.dumps(params), headers=headers)
        
        print(res.text)
        
        result = json.loads(res.text)
        
        print(result)
        
#        self.__openuserid__(result.get("corpId"), result.get("corpAccessToken"))
        
#        res = requests.get("https://open.fxiaoke.com/oauth2.0/authorize?responseType=code&appId=%s&redirectUrl=http://223.100.27.233/&state=77598SDASF" % (appid))

        return result
        
    def __openuserid__(self, corpId, token):
        
        url = "https://open.fxiaoke.com/cgi/user/simpleList"
        
        headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        
        params = {
            "corpId": corpId,
            "corpAccessToken": token,
            "departmentId": 999999
        }
        
        print(params)
        
        res = requests.post(url, data=json.dumps(params), headers=headers)
        
        print(res.text)
        
    def sperson(self, objid, name, ident, phone, type, corpId, token):
        
        ret = self._person(name, ident, phone)

        if ret.get("code") != 0: return

        with open("/home/fenxiang/tmp/%s.pdf" % objid, "wb") as f:
            f.write(base64.b64decode(ret.get("pdf")))
            
        tmpres = os.popen('curl -F "media=@/home/fenxiang/tmp/%s.pdf" "http://open.fxiaoke.com/media/upload?corpAccessToken=%s&corpId=%s&type=document"' % (objid, token, corpId)).readlines()
        
        print(tmpres)

        ret = json.loads(tmpres[0])

        types = {
            "1": {
                "obj": "object_xbm0k__c",
                "file": "field_stuBD__c"
            },
            "2": {
                "obj": "object_ijZGa__c",
                "file": "field_bJ9fg__c"
            },
            "3": {
                "obj": "object_xbfWt__c",
                "file": "field_5i2Bq__c"
            }
        }
        
        type = types.get(type)
        
        headers = {
            "Content-Type": "application/json; charset=utf-8"
        }
        
        params = {
            "corpId": corpId,
            "corpAccessToken": token,
            "currentOpenUserId": "FSUID_2FF4F44A77B22D538277188AE62DA8E8",
            "data": {
                "object_data": {
                    "_id": objid,
                    "dataObjectApiName": type.get("obj"),
                }
            }
        }

        params.get("data").get("object_data")[type.get("file")] = [{
            "ext": "pdf",
            "filename": "%s.pdf" % objid,
            "path": ret.get("mediaId"),
            "size": os.path.getsize("/home/fenxiang/tmp/%s.pdf" % objid),
        }]

        print(params)
        
        res = requests.post("https://open.fxiaoke.com/cgi/crm/custom/v2/data/update", data=json.dumps(params), headers=headers)
        print(res.text)
 

if __name__ == "__main__":
    
    fx = fx()
#    
#    with open("d:\\weixiaobao.jpg","rb") as f:#转为二进制格式
#        base64_data = base64.b64encode(f.read())
#        print(fx._card(base64_data))

#    fx._person(u"宋枢", "210102198706085610", "13998896891")

#    print(fx._car("150119"))

#    print(fx._ccar("宋枢", "13998896891"))
    
#    fx._accessToken_()
#    fx.sperson("", "")

#    req = requests.get("https://www.fxiaoke.com/FSC/EM/File/GetByPath?path=N_202103_17_a0c2cde86b4844a2a5318368588274651.jpg&filetype=jpg")
    
#    print(req.text)

#    args = sys.argv
    
#    ret = fx._accessToken_()
#    fx.sperson(args[1], args[2], args[3], args[4], args[5], ret.get("corpId"), ret.get("corpAccessToken"))

#    ret = fx._accessToken_()
#    fx.__openuserid__(ret.get("corpId"), ret.get("corpAccessToken"))
    
    # python3.7 /home/fenxiang/crontab/flask_fx_script.py 60569997cc0f1e0001d412f9 宋枢 210102198706085610 13998896891 FSCID_B2A02E30387B70C95130F6549D2A6098 52E7B34E857B1341541EFFF63506338D
    
    
    token = "C3EE8D19CB7DC42209E5D91A6E1F6936"
    corpid = "FSCID_B2A02E30387B70C95130F6549D2A6098"
    
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    
    params = {
        "corpId": corpid,
        "corpAccessToken": token,
        "currentOpenUserId": "FSUID_2FF4F44A77B22D538277188AE62DA8E8",
        "data": {
            "dataObjectApiName": "object_ijZGa__c",
            "objectDataId": "6056e60bd0145b00017f7064"
        }
    }
    
#    ret = requests.post("https://open.fxiaoke.com/cgi/crm/custom/v2/data/get", data=json.dumps(params), headers=headers)
#    print(ret.text)
    
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    
    params = {
        "corpId": corpid,
        "corpAccessToken": token,
        "mediaId": "097e2187-244f-426d-843d-1182673f0123"
    }
    
    ret = requests.post("https://open.fxiaoke.com/media/download", data=json.dumps(params), headers=headers)
    print(ret.text)
    
    base64.b64encode(ret.content)
    
    with open("d:/%s.jpg" % "6056e60bd0145b00017f7064", "wb") as f:
        f.write(ret.content)
        
        
    

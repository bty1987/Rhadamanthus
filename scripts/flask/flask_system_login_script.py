#!/usr/bin/evn python
# -*- encoding: utf-8 -*-

import json
import codecs
import requests

class login():
    
    def __convert__(self, data):
        
        data = json.dumps(data)
        data = codecs.decode(data, "unicode-escape")
        
        return data

    def login(self, args, logger, redis, mongo):
        
        key = args.get('userId')
        value = args.get('loginTime')

        redis.set(key, self.__convert__(value), 24 * 60 * 60)

        return {"code": 0, "msg": ""}

    def index(self, args, logger, redis, mongo):

        loginTime = args.get('loginTime')

        _loginTime = redis.get(args.get('userId'))

        result = {"code": 0, "msg": ""}

        if not loginTime or not _loginTime or loginTime != json.loads(_loginTime):
            result['code'] = 110005
            result['msg'] = u'登陆超时'

        return result

    def logout(self, args, logger, redis, mongo):
        
        userId = args.get("userId")
        
        redis.delete(userId)
        
        return {"code": 0, "msg": ""}
    
    def regist(self, args, logger, redis, mongo):
        
        info = json.loads(args["info"])

        macs = mongo.communion["macs"]

        for mac in info:
            if not macs.find_one({"mac": mac["mac"]}): macs.insert(mac)

        return {"code": 0, "msg": ""}  
    
    def weather(self, args, logger, redis, mongo):

        url = "http://api.map.baidu.com/weather/v1/?district_id=%s&data_type=all&ak=49YYCNGougjjYuqAZKqzkBEx"
        citys = [
            {"name": "沈阳", "no": 210100, "weather": {}},
            {"name": "长春", "no": 220100, "weather": {}},
            {"name": "武汉", "no": 420100, "weather": {}},
            {"name": "合肥", "no": 340100, "weather": {}}
        ]
        
        url = "https://restapi.amap.com/v3/weather/weatherInfo?city=%s&key=d25e69c7bb329cd2943697028541f50a"

        code = args.get("code", "210100")

        if not code or code == "":
            code = "210100"

        weather = redis.get("weather-%s" % code)

        if weather and len(weather) != 0:
            return json.loads(weather)

        city = {"name": "", "code": code, "weather": {}}

        info = requests.get(url % (code), data={})
         
        info = json.loads(info.text)
        
        {"status":"1","count":"1","info":"OK","infocode":"10000","lives":[{"province":"辽宁","city":"沈阳市","adcode":"210100","weather":"晴","temperature":"28","winddirection":"南","windpower":"≤3","humidity":"56","reporttime":"2025-08-12 10:32:35","temperature_float":"28.0","humidity_float":"56.0"}]}
  
        #if info.get("message") == "success":
        #    city["weather"] = info["result"].get("now")
        #    city = {**city, **info["result"]["location"]} 
        
        if info.get("info") == "OK":
            
            now = info["lives"][0]
            
            city["name"] = now.get("city")
            city["weather"] = {"text": now.get("weather"), "temp": now.get("temperature"), "rh": now.get("humidity")}

        redis.set("weather-%s" % code, json.dumps(city), 60 * 60)

        return city;
    
    def upgrade(self, args, logger, redis, mongo):
    
        return {"code": 0, "msg": ""}
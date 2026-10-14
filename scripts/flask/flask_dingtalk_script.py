#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

import requests

class dingtalk():
    
    def voice(self, args, logger, redis, mongo):
        
        res = requests.get("http://www.fanglinserver.com/queryDAccessTokenForNew.do?company=1101")
    
        print(res.json())
        
        if res.json().get("errorCode") != 0:
            return {"code": res.json().get("errorCode"), "msg": res.json().get("errorMsg"), "mediaId": ""}
        
        accessToken = res.json().get("dAccessToken").get("accesstoken")
        
        path = args.get("path")
        name = path.split('/')[-1:][0]
        
        res = requests.get("http://www.fanglinserver.com/%s" % (path))
    
        params = {
            "type": "voice",
        }
        
        files = [('media', (name, res.content, 'voice/mp3'))]
        
        res = requests.post("https://oapi.dingtalk.com/media/upload?access_token=%s" % (accessToken), params, files=files)
        
        return {"code": 0, "msg": "", "mediaId": res.json().get("media_id")}

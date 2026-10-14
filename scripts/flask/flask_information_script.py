#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

import datetime
import json
import codecs

class notice():
    
    def __initKey__(self, arr):
        now = datetime.datetime.now()
        key = "_".join([i for i in arr if i])
        return ("%s_%s_%s" % (key, now.month, now.day))

    def __convert__(self, data):
        data = json.dumps(data)
        data = codecs.decode(data, "unicode-escape")
        return data

    def setNotice(self, args, logger, redis, mongo):
        
        noticeType = args.get("noticeType")
        
        dept = args.get("deptId")
        
        company = args.get("company")
        
        if not dept or not noticeType or not company: return

        key = self.__initKey__(["loadNotice", noticeType, dept, company])
        
        source = json.loads(args.get("ntoiceResult"))

        data = {}

        for i, v in enumerate(source["paging"]["data"]):

            element = {}

            _key = "%s_%s" % (v["theme"], i+1)

            for (k,d) in v.items():

                if (k and d) or (k and d==0):

                    if type(d) == dict:

                        creater = {}

                        for (o,e) in d.items():

                            if o and e:

                                creater[o] = e

                        d = self.__convert__(creater)

                    element[k] = d

            data[_key] = self.__convert__(element)

        redis.hmset(key, data)

    def getNotice(self, args, logger, redis, mongo):

        noticeType = args.get("noticeType")
        
        dept = args.get("deptId")
        
        company = args.get("company")
        
        if not dept or not noticeType or not company: return
        
        key = self.__initKey__(["loadNotice", noticeType, dept, company])

        data = redis.hgetall(key)

        if not data: return json.dumps(None)

        result = []

        for i, v in enumerate(data):

            result.append(data[v])

        return json.dumps(result)
    
#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

from flask import Flask, request, Response
from pymongo.mongo_client import MongoClient
import datetime
import json
import logging
import os
import redis
from aes import AESENCRYPT


app = Flask(__name__)

app.logger.setLevel(logging.INFO)

modernFilePath = os.path.realpath(__file__)
configPath = "%s/%s" % (os.path.dirname(modernFilePath), "config.json")

config = json.load(open(configPath))

debug = config.get("debug") == str(True)

rc = None
mg = None

def callBackMethod(clsStr, prefix=""):
    invoke, _, method = clsStr.rpartition('.')
    module_name, _, cls_name = invoke.rpartition('.')
    module = __import__(prefix and "%s.%s" % (prefix, module_name) or module_name)
    clsDef = getattr(module, cls_name)()
    return getattr(clsDef, method)

def __rediscache__(db):
    global rc

    if not rc:
        redis_config = config.get('redis')
        rc = redis.Redis(connection_pool=redis.ConnectionPool(host=redis_config.get("host"), password=redis_config.get("password"), db=db, decode_responses=True))

    return rc

def __mongo__():
    global mg

    if not mg:
        mongo_config = config.get('mongoDB')
        mg = MongoClient(host = mongo_config.get("host"), port=mongo_config.get("port"))
    
    return mg

def __logger__():
    return app.logger

def __recovery__(rc, mg):
    if rc: del rc
    if mg: del mg
    
def _response_headers(content):
    resp = Response(content)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route("/library", methods=["GET", "POST"])
def sharedPost():
    
#    app.logger.info('info log')
#    app.logger.warning('warning log')
    
    values = {}
    result = {}
    
    for key, value in request.values.items():
    
        if re.findall(re.compile("\[(\d+)\]\."), key) != []:

            itemclazz = re.split(re.compile("\[\d+\]\."), key)[0]
            itemname = re.split(re.compile("\[\d+\]\."), key)[1]
            itemindex = int(re.findall(re.compile("\[(\d+)\]\."), key)[0])

            print(itemclazz, itemname, itemindex)

            if not values.get(itemclazz): values[itemclazz] = []

            if len(values.get(itemclazz)) == itemindex: values.get(itemclazz).append({})
            if len(values.get(itemclazz)) < itemindex: continue

            values.get(itemclazz)[itemindex][itemname] = value

        else:
            values[key] = value
    
    if request.get_data():
        values.update(json.loads(request.get_data()))

    raisecache = None
    mongodata = None

    if "redis" in values:

        db = values.pop("redis")

        if not db or not db.isdigit() or not 0 <= int(db.encode("utf-8")) <= 15:
            db = 0

        raisecache = __rediscache__(db)

    if "mongo" in values:
        values.pop("mongo")
        mongodata = __mongo__()
        
    if "company" in values:
        _company = values.pop("company")
        
        _company = AESENCRYPT(config.get("aes").get("key"), config.get("aes").get("iv")).decrypt(_company)
        
        _length = len(_company)
        oneindex = int(_company[_length-2:_length-1])
        twoindex = int(_company[_length-1])
        
        _company = int(_company[oneindex:oneindex+twoindex])
        
        values["company"] = _company
        
    if "api" in values:
        try:
            api = values.pop("api")
            result = callBackMethod(api)(values, logger=app.logger, redis=raisecache, mongo=mongodata)
            app.logger.info("%s|AI|I|%s" % (datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), api))
        except Exception as e:
            result = "Exception: No Class or Method: %s" % e
            if debug: raise e

    return _response_headers(json.dumps(result))

if __name__ == "__main__":
    flask_config = config.get('flask')
    app.run(host = flask_config.get("host"), port = flask_config.get("port"), debug = True)
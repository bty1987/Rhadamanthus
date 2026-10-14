#!/usr/bin/evn python3
# -*- encoding: utf-8 -*-

import json
import os
import requests
from datetime import datetime

class chatGPT():
    def __init__(self):
        config = json.load(open("%s/%s" % (os.getcwd(), "config.json"), encoding="utf-8"))

        self.api_key = config.get("moonshot_api_key")
        self.api_url = config.get("moonshot_api_url")
        self.api_url_file = config.get("moonshot_api_url_file")

    def __login__(self, redis, userId):

        userConfig = redis.get("%s-chat" % userId)

        if userConfig:
            userConfig = json.loads(userConfig)

            if userConfig.get("count") == 0:
                return {"code": -1, "msg": "已达今日最大次数"}

            count = userConfig.get("count")-1

        else:
            count = 50

        data = {'count': count}

        redis.set("%s-chat" % userId, json.dumps(data))

        now = datetime.now()

        end_of_day = datetime.combine(now.date(), datetime.max.time())  # 拼接当天的24:00时刻

        remaining_seconds = int((end_of_day - now).total_seconds())  # 计算当天剩余的时间(秒)

        redis.expire("%s-chat" % userId, remaining_seconds)

    def chat_moonshot(self, args):

        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer %s' % self.api_key,
        }

        data = {
            "model": "moonshot-v1-8k",
            "messages": [
                {"role": "user", "content": "%s" % args.get("question")}
            ],
            "temperature": 0.3
        }

        if args.get("file_content"):
            data["messages"].append({"role": "system", "content": "%s" % args.get("file_content")})

        completion = json.loads(requests.post(self.api_url, headers=headers, data=json.dumps(data)).text)
        # completion = json.loads(requests.post(self.api_url, headers=headers, data=json.dumps(data), verify=False).text)

        if not completion:
            return {"code": -1, "msg": "REQUEST ERROR"}

        if completion.get("error"):
            return {"code": -2, "msg": "%s, %s" % (completion.get("error").get("type"), completion.get("error").get("message"))}

        if completion.get("choices"):
            return {"code": 0, "msg": "", "content": completion["choices"][0]["message"]["content"]}

    def chat(self, args, logger, redis, mongo):

        redisData = self.__login__(redis, args.get("userId"))

        if redisData:
            return redisData

        headers = {
            'Authorization': 'Bearer %s' % self.api_key,
        }

        file_list = json.loads(requests.get(self.api_url_file, headers=headers).text) # 查询全部文件
        # file_list = json.loads(requests.get(self.api_url_file, headers=headers, verify=False).text)

        content = ""

        if not file_list.get("data") or len(file_list.get("data")) == 0:
            return self.chat_moonshot(args)

        for file in file_list.get("data"):

            file_content = self.get_file_content(headers, file)

            args["file_content"] = file_content

            completion = self.chat_moonshot(args)

            if completion.get("code") == 0:
                content = "%s\n%s" % (content, completion.get("content"))
            else:
                return completion

        return {"code": 0, "msg": "", "content": content}

    def get_file_content(self, headers, file): # 获取文件内容

        url = "%s/%s/content" % (self.api_url_file, file.get("id"))

        return requests.get(url, headers=headers).text
        # return requests.get(url, headers=headers, verify=False).text

    def upload_files(self, args, logger, redis, mongo): # 上传文件

        headers = {
            'Authorization': 'Bearer %s' % self.api_key,
        }

        file_url = args.get('url')

        if file_url:

            files = {'file': open(file_url, 'rb'), 'purpose': "file-extract"}

            request = requests.post(self.api_url_file, headers=headers, files=files).text # 上传文件
            # request = requests.post(self.api_url_file, headers=headers, files=files, verify=False).text  # 上传文件

            if not request:
                return {"code": -1, "msg": "REQUEST ERROR"}

            return {"code": 0, "msg": "", "content": request}

    def delete_file(self, args, logger, redis, mongo): # 删除文件

        fileName = args.get("fileName")

        headers = { 'Authorization': 'Bearer %s' % self.api_key}

        file_list = json.loads(requests.get(self.api_url_file, headers=headers).text)  # 查询全部文件

        for file in file_list.get("data"):

            if fileName == file.get("filename"):

                url = "%s/%s" % (self.api_url_file, file.get("id"))

                request = requests.delete(url, headers=headers).text

                if not request:
                    return {"code": -1, "msg": "REQUEST ERROR"}

                return {"code": 0, "msg": "", "content": request}


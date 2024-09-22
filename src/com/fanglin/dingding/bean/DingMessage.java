package com.fanglin.dingding.bean;

import java.util.Arrays;
import java.util.List;

import com.alibaba.fastjson.JSONObject;

/**
 * { "message_url": "http://dingtalk.com", "head": { "bgcolor": "FFCC0000" }, "body": { "title": "标题", "form": [ { "key": "姓名", "value": "张三" }, { "key": "年龄", "value": "30" } ], "rich": { "num": "15.6", "unit": "元" }, "content": "大段文本", "image": "@lADOAAGXIszazQKA", "file_count": "3", "author": "李四" }
 */
public class DingMessage {

	private String robotCode;

	private int remindType;

	private List<String> receiverUserIdList;

	private String content;

	public String getRobotCode() {
		return robotCode;
	}

	public void setRobotCode(String robotCode) {
		this.robotCode = robotCode;
	}

	public int getRemindType() {
		return remindType;
	}

	public void setRemindType(int remindType) {
		this.remindType = remindType;
	}

	public List<String> getReceiverUserIdList() {
		return receiverUserIdList;
	}

	public void setReceiverUserIdList(List<String> receiverUserIdList) {
		this.receiverUserIdList = receiverUserIdList;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public JSONObject phone(String robotCode, String receiverId, String content) {

		JSONObject json = new JSONObject();

		json.put("robotCode", robotCode);
		json.put("remindType", 3);
		json.put("receiverUserIdList", Arrays.asList(receiverId));
		json.put("content", content);

		return json;
	}

}

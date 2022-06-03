package com.fanglin.dingding.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class TextMessage {

	private String TYPE_TEXT_STR = "text";

	private String content;

	public TextMessage(String content) {
		super();
		this.content = content;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public JSONObject delivery() {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_TEXT_STR);
		json.put(this.TYPE_TEXT_STR, JSON.toJSON(this));

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_TEXT_STR);
		json.put(this.TYPE_TEXT_STR, JSON.toJSON(this));

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

}

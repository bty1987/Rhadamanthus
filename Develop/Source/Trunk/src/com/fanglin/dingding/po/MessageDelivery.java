package com.fanglin.dingding.po;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class MessageDelivery {
	
	private String msgtype;
	
	private Message message;
	
	public MessageDelivery withMessage(Message msg) {
		this.msgtype = msg.type();
		this.message = msg;
		return this;
	}
	
	public JSONObject toJsonObject() {
		JSONObject json = new JSONObject();
		json.put("msgtype", this.msgtype);
		json.put(this.msgtype, JSON.toJSON(this.message));
		return json;
	}

	public String getMsgtype() {
		return msgtype;
	}

	public void setMsgtype(String msgtype) {
		this.msgtype = msgtype;
	}

	public Message getMessage() {
		return message;
	}

	public void setMessage(Message message) {
		this.message = message;
	}
}

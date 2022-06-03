package com.fanglin.dingding.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class LinkMessage {

	private String TYPE_LINK_STR = "link";

	private String messageUrl;

	private String picUrl;

	private String title;

	private String text;

	public LinkMessage(String messageUrl, String picUrl, String title, String text) {
		super();
		this.messageUrl = messageUrl;
		this.picUrl = picUrl;
		this.title = title;
		this.text = text;
	}

	public String getMessageUrl() {
		return messageUrl;
	}

	public void setMessageUrl(String messageUrl) {
		this.messageUrl = messageUrl;
	}

	public String getPicUrl() {
		return picUrl;
	}

	public void setPicUrl(String picUrl) {
		this.picUrl = picUrl;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public JSONObject delivery() {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_LINK_STR);
		json.put(this.TYPE_LINK_STR, JSON.toJSON(this));

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_LINK_STR);
		json.put(this.TYPE_LINK_STR, JSON.toJSON(this));

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

}

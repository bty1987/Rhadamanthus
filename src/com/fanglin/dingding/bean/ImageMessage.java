package com.fanglin.dingding.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class ImageMessage {

	private String TYPE_IMAGE_STR = "markdown";

	private String title;

	private String text;

	public ImageMessage(String path) {

		super();

		this.title = "图片";
		this.text = String.format("![](%s)", path);
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

		json.put("msgtype", this.TYPE_IMAGE_STR);
		json.put(this.TYPE_IMAGE_STR, JSON.toJSON(this));

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_IMAGE_STR);
		json.put(this.TYPE_IMAGE_STR, JSON.toJSON(this));

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

}

package com.fanglin.dingding.bean;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import com.alibaba.fastjson.JSONObject;

public class AppMessage {

	private String TYPE_APP_STR = "action_card";

	private String title;

	private String markdown;

	private String url;

	private String single;

	public AppMessage(String title, String url, String single) {

		super();

		this.title = title;
		this.url = url;
		this.single = single;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUrl() {

		try {
			System.out.println(URLEncoder.encode(this.url, "utf-8"));
			return URLEncoder.encode(this.url, "utf-8");
		} catch (UnsupportedEncodingException e) {
			return "";
		}
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getSingle() {
		return single;
	}

	public void setSingle(String single) {
		this.single = single;
	}

	public String getMarkdown() {
		return markdown;
	}

	public void setMarkdown(String markdown) {
		this.markdown = markdown;
	}

	public JSONObject delivery() {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_APP_STR);

		JSONObject app = new JSONObject();

		app.put("title", getTitle());
		app.put("markdown", getTitle());
		app.put("single_title", getSingle());
		app.put("single_url", "dingtalk://dingtalkclient/action/openapp?container_type=work_platform&app_id=0_23777027&redirect_type=jump&redirect_url=" + getUrl());

		json.put(this.TYPE_APP_STR, app);

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_APP_STR);

		JSONObject app = new JSONObject();

		app.put("title", getTitle());
		app.put("markdown", getTitle());
		app.put("single_title", getSingle());
		app.put("single_url", getUrl());

		json.put(this.TYPE_APP_STR, app);

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

	public static void main(String[] args) {

	}

}

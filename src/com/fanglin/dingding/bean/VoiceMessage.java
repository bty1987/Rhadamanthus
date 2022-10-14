package com.fanglin.dingding.bean;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class VoiceMessage {

	private String TYPE_VOICE_STR = "voice";

	private String media_id;

	private int duration;

	public VoiceMessage(String mediaId, int duration) {
		super();
		this.media_id = mediaId;
		this.duration = duration;
	}

	public String getMedia_id() {
		return media_id;
	}

	public void setMedia_id(String media_id) {
		this.media_id = media_id;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public JSONObject delivery() {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_VOICE_STR);
		json.put(this.TYPE_VOICE_STR, JSON.toJSON(this));

		return json;
	}

	public JSONObject delivery(String agentId, String receiverId, String deptId) {

		JSONObject json = new JSONObject();

		json.put("msgtype", this.TYPE_VOICE_STR);
		json.put(this.TYPE_VOICE_STR, JSON.toJSON(this));

		json.put("touser", receiverId);
		json.put("toparty", deptId);
		json.put("agentid", agentId);

		return json;
	}

}

package com.fanglin.dingding.po;

import com.alibaba.fastjson.JSONObject;

public class AppMessageDelivery extends MessageDelivery {

	private String touser;
	
	private String toparty;
	
	private String agentid;
	
	public AppMessageDelivery(String toUsers, String toParties, String agentId) {
		this.touser = toUsers;
		this.toparty = toParties;
		this.agentid = agentId;
	}
	
	@Override
	public JSONObject toJsonObject() {
		JSONObject json = super.toJsonObject();
		json.put("touser", this.touser);
		json.put("toparty", this.toparty);
		json.put("agentid", this.agentid);
		
		return json;
	}

	public String getTouser() {
		return touser;
	}

	public void setTouser(String touser) {
		this.touser = touser;
	}

	public String getToparty() {
		return toparty;
	}

	public void setToparty(String toparty) {
		this.toparty = toparty;
	}

	public String getAgentid() {
		return agentid;
	}

	public void setAgentid(String agentid) {
		this.agentid = agentid;
	}
}

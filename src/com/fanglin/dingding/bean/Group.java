package com.fanglin.dingding.bean;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;

public class Group {

	private String chatId;

	private String openId;

	private String name;

	private String owner;

	private List<String> users;

	private Short showHistoryType;

	private Short searchable;

	private Short validationType;

	private Short mentionAllAuthority;

	private Short managementType;

	private Short chatBannedType;

	private String msg;

	public static short SHOW_HISTORY_TYPE_ENABLE_INT = 1;

	public static short SEARCHABLE_ENABLE_INT = 1;

	public static short VALIDATION_TYPE_CHECK_INT = 1;

	public static short MENTION_ALL_AUTHORITY_MANAGE_INT = 1;

	public static short MANAGEMENT_TYPE_MANAGE_INT = 1;

	public static short CHAT_BANNED_TYPE_DISABLE_INT = 0;

	public Group() {
		super();

		setUsers(new ArrayList<String>());
	}

	public Group(String chatId, String openId) {
		super();
		this.chatId = chatId;
		this.openId = openId;
	}

	public Group init() {

		setShowHistoryType(SHOW_HISTORY_TYPE_ENABLE_INT);
		setSearchable(SEARCHABLE_ENABLE_INT);
		setValidationType(VALIDATION_TYPE_CHECK_INT);
		setMentionAllAuthority(MENTION_ALL_AUTHORITY_MANAGE_INT);
		setManagementType(MANAGEMENT_TYPE_MANAGE_INT);
		setChatBannedType(CHAT_BANNED_TYPE_DISABLE_INT);

		return this;
	}

	public String getChatId() {
		return chatId;
	}

	public void setChatId(String chatId) {
		this.chatId = chatId;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public List<String> getUsers() {
		return users;
	}

	public void setUsers(List<String> users) {
		this.users = users;
	}

	public Short getShowHistoryType() {
		return showHistoryType;
	}

	public void setShowHistoryType(Short showHistoryType) {
		this.showHistoryType = showHistoryType;
	}

	public Short getSearchable() {
		return searchable;
	}

	public void setSearchable(Short searchable) {
		this.searchable = searchable;
	}

	public Short getValidationType() {
		return validationType;
	}

	public void setValidationType(Short validationType) {
		this.validationType = validationType;
	}

	public Short getMentionAllAuthority() {
		return mentionAllAuthority;
	}

	public void setMentionAllAuthority(Short mentionAllAuthority) {
		this.mentionAllAuthority = mentionAllAuthority;
	}

	public Short getManagementType() {
		return managementType;
	}

	public void setManagementType(Short managementType) {
		this.managementType = managementType;
	}

	public Short getChatBannedType() {
		return chatBannedType;
	}

	public void setChatBannedType(Short chatBannedType) {
		this.chatBannedType = chatBannedType;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public JSONObject toJson() {

		JSONObject json = JSONObject.parseObject(JSONObject.toJSONString(this));

		json.put("openConversationId", getOpenId());
		json.put("chatid", getChatId());

		json.put("useridlist", json.get("users"));

		return json;
	}

	public JSONObject addUser() {

		JSONObject json = JSONObject.parseObject(JSONObject.toJSONString(this));

		json.put("openConversationId", getOpenId());
		json.put("chatid", getChatId());

		json.put("add_useridlist", json.get("users"));

		return json;
	}

	public JSONObject deleteUser() {

		JSONObject json = JSONObject.parseObject(JSONObject.toJSONString(this));

		json.put("openConversationId", getOpenId());
		json.put("chatid", getChatId());

		json.put("del_useridlist", json.get("users"));

		return json;
	}

	public JSONObject send(JSONObject msg) {

		JSONObject json = JSONObject.parseObject(JSONObject.toJSONString(this));

		json.put("openConversationId", getOpenId());
		json.put("chatid", getChatId());

		json.put("msg", msg);

		return json;
	}

	public JSONObject template(String no) {

		JSONObject json = new JSONObject();

		json.put("owner_user_id", getOwner());
		json.put("open_conversation_id", getOpenId());
		json.put("template_id", no);

		return json;
	}
}

package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;

public class DroupVO implements Serializable {

	private static final long serialVersionUID = -4819376958141718230L;

	private Long did;

	private String name;

	private DecorationVO decoration;

	private String chatId;

	private String openId;

	private String userId;

	private Short status;

	private Short isHandle;

	private Short isRead;

	private Timestamp updateTime;

	private Timestamp handleTime;

	private Integer company;

	public DroupVO() {
		super();
	}

	public DroupVO(DecorationVO decoration) {
		super();
		this.decoration = decoration;
	}

	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Short getIsHandle() {
		return isHandle;
	}

	public void setIsHandle(Short isHandle) {
		this.isHandle = isHandle;
	}

	public Short getIsRead() {
		return isRead;
	}

	public void setIsRead(Short isRead) {
		this.isRead = isRead;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getHandleTime() {
		return handleTime;
	}

	public void setHandleTime(Timestamp handleTime) {
		this.handleTime = handleTime;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public DroupVO filter(List<Filter> filters) {

		if (getStatus() != null) {
			filters.add(0, new Filter("status", String.valueOf(getStatus()), "eq"));
		}

		return this;
	}

}

/**
 * @File Name		: A20260109Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-01-09
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: ERP事件发布
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20260109Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20260109Action extends BaseListAction {

	private static final long serialVersionUID = 3540333987788927680L;

	@Autowired
	private A20260109Service a20260109Service;

	private JSONObject result;

	private String eventType;

	private String orderId;

	private Long cnid;

	private Integer userId;

	@Action(value = "publishErpEvent", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String publishErpEvent() throws FLException {

		result = a20260109Service.publishErpEvent(eventType, orderId, cnid, userId);

		return SUCCESS;
	}

	public JSONObject getResult() {
		return result;
	}

	public void setResult(JSONObject result) {
		this.result = result;
	}

	public String getEventType() {
		return eventType;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

}

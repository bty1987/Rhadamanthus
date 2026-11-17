/**
 * @File Name		: A20261117Action.java
 * @Package   	: com.fanglin.seiya.action
 * @Version		: 1.0
 * @Date			: 2026-11-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 上方系统定额补数端点(按装修单触发, Phase 1 独立触发; 后续 makeNormtion 接线复用服务层)
 */

package com.fanglin.seiya.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.seiya.service.A20261117Service;

@ParentPackage("base")
@Namespace("/")
@Controller
public class A20261117Action extends BaseListAction {

	private static final long serialVersionUID = 20261117L;

	@Autowired
	private A20261117Service a20261117Service;

	/** 装修单号(即上方系统 erpOrderCode) */
	private String orderId;

	/** 补插定额行数(反馈用) */
	private int count;

	@Action(value = "supplementNormForSync", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String supplementNormForSync() throws FLException {

		count = a20261117Service.supplementNormForSync(orderId, queryUserId());

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}

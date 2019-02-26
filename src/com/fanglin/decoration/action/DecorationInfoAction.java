package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.service.DecorationInfoService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationInfoAction extends BaseListAction {

	private static final long serialVersionUID = 4776041931383364604L;

	private String orderId;

	@Autowired
	private DecorationInfoService decorationInfoService;

	private DecorationInfoPO decorationInfo;

	@Action(value = "queryDecorationInfoByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationInfoByOrderId() throws FLException {

		decorationInfo = decorationInfoService.queryDecorationInfoByOrderId(orderId);

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public DecorationInfoPO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoPO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

}

package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationInfoService;
import com.fanglin.decoration.vo.DecorationInfoVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationInfoAction extends BaseListAction {

	private static final long serialVersionUID = 4776041931383364604L;

	@Autowired
	private DecorationInfoService decorationInfoService;

	private DecorationInfoVO decorationInfo;

	@Action(value = "queryDecorationInfoByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationInfoByOrderId() throws FLException {

		decorationInfo = decorationInfoService.queryDecorationInfoByOrderId(decorationInfo);

		return SUCCESS;
	}

	@Action(value = "queryDecorationInfoForCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationInfoForCustomer() throws FLException {

		decorationInfo = decorationInfoService.queryDecorationInfoForCustomer(decorationInfo);

		return SUCCESS;
	}

	@Action(value = "sendDecorationInfoForConfirm", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationInfoForConfirm() throws FLException {

		decorationInfoService.sendDecorationInfoForConfirm(decorationInfo);

		return SUCCESS;
	}

	public DecorationInfoVO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoVO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

}

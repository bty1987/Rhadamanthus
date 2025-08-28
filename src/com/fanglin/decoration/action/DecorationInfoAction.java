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
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationInfoAction extends BaseListAction {

	private static final long serialVersionUID = 4776041931383364604L;

	@Autowired
	private DecorationInfoService decorationInfoService;

	private DecorationInfoVO decorationInfo;

	private DecorationVO decoration;

	private String orderId;

	private String securityCode;

	private String verifyCode;

	@Action(value = "queryDecorationInfoByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationInfoByOrderId() throws FLException {

		if (decorationInfo == null) decorationInfo = new DecorationInfoVO();
		if (decorationInfo.getOrderId() == null && orderId != null) decorationInfo.setOrderId(orderId);

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

		decorationInfoService.sendDecorationInfoForConfirm(decorationInfo, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmDecorationInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmDecorationInfo() throws FLException {

		decorationInfoService.confirmDecorationInfo(decoration, decorationInfo, securityCode, verifyCode);

		return SUCCESS;
	}

	@Action(value = "referDecorationInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String referDecorationInfo() throws FLException {

		decorationInfoService.referDecorationInfo(decoration, decorationInfo);

		return SUCCESS;
	}

	public DecorationInfoVO getDecorationInfo() {
		return decorationInfo;
	}

	public void setDecorationInfo(DecorationInfoVO decorationInfo) {
		this.decorationInfo = decorationInfo;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

}

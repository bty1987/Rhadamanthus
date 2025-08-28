package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAccountAction extends BaseListAction {

	private static final long serialVersionUID = -8803199049521929598L;

	@Autowired
	private DecorationAccountService decorationAccountService;

	private DecorationVO decoration;

	private DecorationAccountVO decorationAccount;

	private String orderId;

	private String approve;

	private String securityCode;

	private String verifyCode;

	@Action(value = "queryDecorationAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAccountAction() throws FLException {

		decorationAccount = decorationAccountService.queryDecorationAccount(decorationAccount);

		return SUCCESS;
	}

	@Action(value = "updateDecorationAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationAccount() throws FLException {

		decorationAccountService.updateDecorationAccount(decorationAccount);

		return SUCCESS;
	}

	@Action(value = "makeDecorationAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationAccountAction() throws FLException {

		if (decorationAccount == null) decorationAccount = new DecorationAccountVO();
		if (decorationAccount.getOrderId() == null && orderId != null) decorationAccount.setOrderId(orderId);

		if ("agree".equals(approve)) decorationAccountService.makeDecorationAccount(decorationAccount, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendDecorationAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendDecorationAccount() throws FLException {

		decorationAccountService.sendDecorationAccount(decorationAccount, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmDecorationAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmAddReduce() throws FLException {

		decorationAccountService.affirmDecorationAccount(decoration, decorationAccount, securityCode, verifyCode);

		return SUCCESS;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public DecorationAccountVO getDecorationAccount() {
		return decorationAccount;
	}

	public void setDecorationAccount(DecorationAccountVO decorationAccount) {
		this.decorationAccount = decorationAccount;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getApprove() {
		return approve;
	}

	public void setApprove(String approve) {
		this.approve = approve;
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

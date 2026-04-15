package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalPaymentWithdrawService;
import com.fanglin.approval.vo.ApprovalPaymentWithdrawVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalPaymentWithdrawAction extends BaseListAction {

	private static final long serialVersionUID = -3912438795410984567L;

	@Autowired
	private ApprovalPaymentWithdrawService approvalPaymentWithdrawService;

	private ApprovalVO approval;

	private ApprovalPaymentWithdrawVO approvalPaymentWithdraw;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForPaymentWithdraw", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForPaymentWithdraw() throws FLException {

		approvalPaymentWithdrawService.submitApprovalForPaymentWithdraw(approval, approvalPaymentWithdraw, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalPaymentWithdrawVO getApprovalPaymentWithdraw() {
		return approvalPaymentWithdraw;
	}

	public void setApprovalPaymentWithdraw(ApprovalPaymentWithdrawVO approvalPaymentWithdraw) {
		this.approvalPaymentWithdraw = approvalPaymentWithdraw;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getForms() {
		return forms;
	}

	public void setForms(String forms) {
		this.forms = forms;
	}

}

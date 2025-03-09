package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalQuotationPreferService;
import com.fanglin.approval.vo.ApprovalQuotationPreferVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalQuotationPreferAction extends BaseListAction {

	private static final long serialVersionUID = -6727846038637862075L;

	@Autowired
	private ApprovalQuotationPreferService approvalQuotationPreferService;

	private ApprovalVO approval;

	private ApprovalQuotationPreferVO approvalQuotationPrefer;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForQuotationPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForQuotationPrefer() throws FLException {

		approvalQuotationPreferService.submitApprovalForQuotationPrefer(approval, approvalQuotationPrefer, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalQuotationPreferVO getApprovalQuotationPrefer() {
		return approvalQuotationPrefer;
	}

	public void setApprovalQuotationPrefer(ApprovalQuotationPreferVO approvalQuotationPrefer) {
		this.approvalQuotationPrefer = approvalQuotationPrefer;
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

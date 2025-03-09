package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalDecorationContractService;
import com.fanglin.approval.vo.ApprovalDecorationContractVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalDecorationContractAction extends BaseListAction {

	private static final long serialVersionUID = -6931238619120160111L;

	@Autowired
	private ApprovalDecorationContractService approvalDecorationContractService;

	private ApprovalVO approval;

	private ApprovalDecorationContractVO approvalDecorationContract;

	private String code;

	private String forms;

	@Action(value = "submitApprovalForDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForQuotationPrefer() throws FLException {

		approvalDecorationContractService.submitApprovalForDecorationContract(approval, approvalDecorationContract, queryUserId(), queryCompany(), code, forms);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationContractVO getApprovalDecorationContract() {
		return approvalDecorationContract;
	}

	public void setApprovalDecorationContract(ApprovalDecorationContractVO approvalDecorationContract) {
		this.approvalDecorationContract = approvalDecorationContract;
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

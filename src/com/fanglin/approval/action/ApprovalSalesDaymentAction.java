package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalSalesDaymentService;
import com.fanglin.approval.vo.ApprovalSalesDaymentVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalSalesDaymentAction extends BaseListAction {

	private static final long serialVersionUID = -6396203152531877272L;

	@Autowired
	private ApprovalSalesDaymentService approvalSalesDaymentService;

	private ApprovalVO approval;

	private ApprovalSalesDaymentVO approvalSalesDayment;

	@Action(value = "submitApprovalForSalesDayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForSalesDayment() throws FLException {

		approvalSalesDaymentService.submitApprovalForSalesDayment(approval, approvalSalesDayment, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalSalesDaymentVO getApprovalSalesDayment() {
		return approvalSalesDayment;
	}

	public void setApprovalSalesDayment(ApprovalSalesDaymentVO approvalSalesDayment) {
		this.approvalSalesDayment = approvalSalesDayment;
	}
}

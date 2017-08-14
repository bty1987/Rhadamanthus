package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalSalesDiscountService;
import com.fanglin.approval.vo.ApprovalSalesDiscountVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;


@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalSalesDiscountAction extends BaseListAction {
	private static final long serialVersionUID = -2161074768558759346L;
	
	@Autowired
	private ApprovalSalesDiscountService approvalSalesDiscountService;
	
	private ApprovalVO approval;

	private ApprovalSalesDiscountVO approvalSalesDiscount;

	@Action(value = "submitApprovalForSalesDiscount", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String submitApprovalForSalesDiscount() throws FLException {
	
		approvalSalesDiscountService.submitApprovalSalesDiscount(approval,approvalSalesDiscount, queryUserId(), queryCompany());

		return SUCCESS;

	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalSalesDiscountVO getApprovalSalesDiscount() {
		return approvalSalesDiscount;
	}

	public void setApprovalSalesDiscount(
			ApprovalSalesDiscountVO approvalSalesDiscount) {
		this.approvalSalesDiscount = approvalSalesDiscount;
	}

	
}

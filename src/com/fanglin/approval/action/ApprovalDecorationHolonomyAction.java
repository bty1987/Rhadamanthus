package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalDecorationHolonomyService;
import com.fanglin.approval.vo.ApprovalDecorationHolonomyVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller("submitApprovalForDecorationHolonomy")
public class ApprovalDecorationHolonomyAction extends BaseListAction {

	private static final long serialVersionUID = -549271005174823538L;

	@Autowired
	private ApprovalDecorationHolonomyService approvalDecorationHolonomyService;

	private ApprovalVO approval;

	private ApprovalDecorationHolonomyVO approvalDecorationHolonomy;

	@Action(value = "submitApprovalForDecorationHolonomy", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForDecorationHolonomy() throws FLException {

		approvalDecorationHolonomyService.submitApprovalForDecorationHolonomy(approval, approvalDecorationHolonomy, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

	public ApprovalDecorationHolonomyVO getApprovalDecorationHolonomy() {
		return approvalDecorationHolonomy;
	}

	public void setApprovalDecorationHolonomy(ApprovalDecorationHolonomyVO approvalDecorationHolonomy) {
		this.approvalDecorationHolonomy = approvalDecorationHolonomy;
	}

}

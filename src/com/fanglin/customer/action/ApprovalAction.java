package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ApprovalService;
import com.fanglin.customer.vo.ApprovalVO;

@ParentPackage("base")
@Namespace("/")
@Controller("ApprovalOrderAction")
public class ApprovalAction extends BaseListAction {

	private static final long serialVersionUID = -5147550362380249742L;

	@Autowired
	private ApprovalService approvalService;

	private ApprovalVO approval;

	@Action(value = "queryApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApproval() throws FLException {

		approval = approvalService.queryApproval(approval);

		return SUCCESS;
	}

	@Action(value = "confirmApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmApproval() throws FLException {

		approvalService.confirmApproval(approval);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

}

package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalService;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
@ParentPackage("common")
@Namespace("/")
@Controller
public class ApprovalCommonAction extends BaseListAction {
	
	private static final long serialVersionUID = -5746700453567226497L;

	@Autowired
	private ApprovalService approvalService;

	private ApprovalVO approval;
	
	@Action(value = "approvalCallback", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String approvalCallback() throws FLException {

		approvalService.approvalCallback(approval);

		return SUCCESS;
	}

	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
	}

}

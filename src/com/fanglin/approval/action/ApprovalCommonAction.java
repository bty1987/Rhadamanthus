package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalCommonService;
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
	
	@Autowired
	private ApprovalCommonService approvalCommonService;

	private ApprovalVO approval;
	
	private String code;
	
	private String forms;
	
	@Action(value = "submitApprovalForDing", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String submitApprovalForDing() throws FLException {

		approvalCommonService.submitApprovalForDing(code, forms, queryUserId(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "approvalCallback", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String approvalCallback() throws FLException {

		approvalService.approvalCallback(approval);

		return SUCCESS;
	}

	//客户确认
	@Action(value = "confirmApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmApproval() throws FLException {

		approvalCommonService.confirmApproval(approval);

		return SUCCESS;
	}
	
	//客户拒绝
	@Action(value = "rejectApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectApproval() throws FLException {

		approvalCommonService.rejectApproval(approval);

		return SUCCESS;
	}
	
	public ApprovalVO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalVO approval) {
		this.approval = approval;
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

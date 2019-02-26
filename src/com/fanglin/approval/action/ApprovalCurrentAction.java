package com.fanglin.approval.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalCurrentService;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalCurrentAction extends BaseListAction {

	private static final long serialVersionUID = -4419333771627771933L;

	@Autowired
	private ApprovalCurrentService approvalCurrentService;
	
	private String code;

	private String rule;
	
	private String comment;
	
	private String forms;
	
	@Action(value = "submitApprovalForAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForAddReduce() throws FLException {

		approvalCurrentService.submitApprovalForAddReduce(queryUserId(), code, forms, rule, queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "submitApprovalForPosition", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForPosition() throws FLException {

		approvalCurrentService.submitApprovalForPosition(queryUserId(), code, forms, rule, comment, queryCompany());

		return SUCCESS;
	}

	public String getForms() {
		return forms;
	}

	public void setForms(String forms) {
		this.forms = forms;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRule() {
		return rule;
	}

	public void setRule(String rule) {
		this.rule = rule;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}

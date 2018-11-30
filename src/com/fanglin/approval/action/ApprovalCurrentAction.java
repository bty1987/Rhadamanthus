package com.fanglin.approval.action;

import java.util.Map;

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
	
	private Map<String, String> args;
	
	@Action(value = "submitApprovalForAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForAddReduce() throws FLException{
		
		approvalCurrentService.submitApprovalForAddReduce(queryUserId(),args,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "submitApprovalForResignation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitApprovalForResignation() throws FLException{
		
		approvalCurrentService.submitApprovalForResignation(queryUserId(),args,queryCompany());
		
		return SUCCESS;
	}

	public Map<String, String> getArgs() {
		return args;
	}

	public void setArgs(Map<String, String> args) {
		this.args = args;
	}

}

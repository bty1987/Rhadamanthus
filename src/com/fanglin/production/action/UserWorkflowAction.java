package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.UserWorkflowService;
import com.fanglin.production.vo.UserWorkflowVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserWorkflowAction extends BaseListAction {

	private static final long serialVersionUID = 7612506924299780280L;

	@Autowired
	private UserWorkflowService userWorkflowService;

	private UserWorkflowVO userWorkflow;

	private List<UserWorkflowVO> userWorkflows;

	private List<Long> wfids;

	@Action(value = "queryUserWorkflowByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUserWorkflowByUid() {

		userWorkflows = userWorkflowService.queryUserWorkflowByUid(userWorkflow);

		return SUCCESS;
	}

	@Action(value = "updateUserWorkflow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateUserWorkflow() throws FLException {

		userWorkflowService.updateUserWorkflow(userWorkflow, wfids);

		return SUCCESS;
	}

	public UserWorkflowVO getUserWorkflow() {
		return userWorkflow;
	}

	public void setUserWorkflow(UserWorkflowVO userWorkflow) {
		this.userWorkflow = userWorkflow;
	}

	public List<UserWorkflowVO> getUserWorkflows() {
		return userWorkflows;
	}

	public void setUserWorkflows(List<UserWorkflowVO> userWorkflows) {
		this.userWorkflows = userWorkflows;
	}

	public List<Long> getWfids() {
		return wfids;
	}

	public void setWfids(List<Long> wfids) {
		this.wfids = wfids;
	}

}

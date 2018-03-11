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
import com.fanglin.production.service.WorkflowService;
import com.fanglin.production.vo.WorkflowVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkflowAction extends BaseListAction {

	private static final long serialVersionUID = 4985552040824794455L;
	
	private  WorkflowVO  workflow ;
	
	private  List<WorkflowVO>  workflows ;
	
	@Autowired
	private WorkflowService  workflowService;
	
	@Action(value = "pageWorkflow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageWorkflow () throws FLException{
	
		workflowService.pageWorkflow(getPaging(), getFilters(),queryCompany());
		
		return  SUCCESS;
	}
	
	@Action(value = "queryWorkflow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkflow() throws FLException{

		workflows =	workflowService.queryWorkflow(queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addWorkflow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorkflow() throws FLException{
		
		workflowService.addWorkflow(workflow,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateWorkflow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkflow() throws Exception{
		
		workflowService.updateWorkflow(workflow);
		
		return SUCCESS;
	}
	
	@Action(value = "updateWorkflowForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkflowForStatus() throws Exception{
		
		workflowService.updateWorkflowForStatus(workflow);
		
		return SUCCESS;
	}

	public WorkflowVO getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowVO workflow) {
		this.workflow = workflow;
	}

	public List<WorkflowVO> getWorkflows() {
		return workflows;
	}

	public void setWorkflows(List<WorkflowVO> workflows) {
		this.workflows = workflows;
	}
	
}

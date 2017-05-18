package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerSalaryAction extends BaseListAction{

	private static final long serialVersionUID = -2156391594302027307L;

	@Autowired
	private WorkerSalaryService workerSalaryService;
	
	private WorkerSalaryVO workerSalary;
	
	@Action(value = "queryWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkerSalary(){
		workerSalaryService.queryWorkerSalaryByCsIdAndUserId(workerSalary);
		return SUCCESS;
	}
	
	@Action(value = "addWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorkerSalary(){
		workerSalaryService.addWorkerSalary(workerSalary);
		return SUCCESS;
	}
	
	public WorkerSalaryVO getWorkerSalary() {
		return workerSalary;
	}

	public void setWorkerSalary(WorkerSalaryVO workerSalary) {
		this.workerSalary = workerSalary;
	}

	public WorkerSalaryService getWorkerSalaryService() {
		return workerSalaryService;
	}

	public void setWorkerSalaryService(WorkerSalaryService workerSalaryService) {
		this.workerSalaryService = workerSalaryService;
	}
}

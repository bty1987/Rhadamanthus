package com.fanglin.salary.action;

import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerSalaryAction extends BaseListAction{
	
	private static final long serialVersionUID = -2156391594302027307L;

	@Autowired
	private WorkerSalaryService workerSalaryService;

	private WorkerSalaryVO workerSalary;
	
	private List<WorkerSalaryVO> workerSalarys;
	
	private List<Long> wsIds;
	
	@Action(value = "pageWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageWorkerSalary (){
		
		workerSalaryService.pageWorkerSalary(getPaging(), getFilters());
		
		return  SUCCESS;
	}

	@Action(value = "queryWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkerSalary(){
		
		workerSalarys = workerSalaryService.queryWorkerSalary(workerSalary);
	
		return SUCCESS;
	}
	@Action(value = "addWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorkerSalary() throws FLException{
		
		workerSalaryService.addWorkerSalary(workerSalary,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkerSalary() throws FLException{
		
		workerSalaryService.updateWorkerSalary(workerSalary);
		
		return SUCCESS;
	}

	@Action(value = "adoptWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String adoptWorkerSalary() throws FLException{
		
		workerSalaryService.adoptWorkerSalary(workerSalarys,queryUserId());
			
		return SUCCESS;
			}
	
	@Action(value = "rejectWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectWorkerSalary() throws FLException{
		
		workerSalaryService.rejectWorkerSalary(workerSalarys,queryUserId());
			
		return SUCCESS;
			}
	
	@Action(value = "deleteWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String deleteWorkerSalary() throws FLException{
		
		workerSalaryService.deleteWorkerSalary(workerSalary);
		
		return  SUCCESS;
		}
	
	public WorkerSalaryVO getWorkerSalary() {
		
		return workerSalary;
	}
	
	public void setWorkerSalary(WorkerSalaryVO workerSalary) {
		
		this.workerSalary = workerSalary;
	}
	
	public List<WorkerSalaryVO> getWorkerSalarys() {
		
		return workerSalarys;
	}

	public void setWorkerSalarys(List<WorkerSalaryVO> workerSalarys) {
		
		this.workerSalarys = workerSalarys;
	}

	public List<Long> getWsIds() {
		return wsIds;
	}

	public void setWsIds(List<Long> wsIds) {
		this.wsIds = wsIds;
	}

	
	
	
}

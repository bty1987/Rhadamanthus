package com.fanglin.salary.action;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerSalaryAction extends BaseListAction{
	
	private static final long serialVersionUID = -2156391594302027307L;
  
	@Autowired 
	private WorkerSalaryService workerSalaryService;
  
	private WorkerSalaryVO workerSalary;
  
	private List<WorkerSalaryVO> workerSalarys; 
	
	private String sourceId;
	
	private String targetId;
	
	@Action(value="pageWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerSalary() throws FLException{
	  
		workerSalaryService.pageWorkerSalary(getPaging(), getFilters(), queryCompany());
    
		return "success";
	}
	
	@Action(value="pageWorkerSalaryByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageSalaryWorkerForUser() throws FLException{
	  
		workerSalaryService.pageWorkerSalaryByUserId(getPaging(), getFilters());
    
		return "success";
	}
	
	@Action(value="queryWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryWorkerSalary() throws FLException{
	  
		workerSalarys = workerSalaryService.queryWorkerSalary(workerSalary);
    
		return "success";
	}
  
	@Action(value="addWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addWorkerSalary() throws FLException{
	  
	  workerSalaryService.addWorkerSalary(workerSalary, queryUserId(), queryCompany());
    
	  return "success";
	}
  
	@Action(value="updateWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateWorkerSalary()throws FLException{
	  
	  workerSalaryService.updateWorkerSalary(workerSalary);
    
	  return "success";
	}
  
	@Action(value="adoptWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String adoptWorkerSalary() throws FLException{
	  
	  workerSalaryService.adoptWorkerSalary(workerSalarys, queryUserId());
    
	  return "success";
	}
  
	@Action(value="rejectWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String rejectWorkerSalary()throws FLException{
	  
		workerSalaryService.rejectWorkerSalary(workerSalary, queryUserId());
	  
		return "success";
	}
  
	@Action(value="deleteWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteWorkerSalary()throws FLException{
	  
		workerSalaryService.deleteWorkerSalary(workerSalary,queryUserId());
    
		return "success";
	}
	
	@Action(value = "collectWorkerDeposit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectWorkerDeposit() throws FLException{
		
		workerSalaryService.collectWorkerDeposit(workerSalary, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "drawWorkerDeposit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String drawWorkerDeposit() throws FLException{
		
		workerSalaryService.drawWorkerDeposit(workerSalary, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "cutWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cutWorkerSalary() throws FLException{
		
		workerSalaryService.cutWorkerSalary(workerSalary, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "tranWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranWorkerSalary() throws FLException{
		
		workerSalaryService.tranWorkerSalary(workerSalary, queryUserId(), sourceId, targetId, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "payWorkerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String payWorkerSalary() throws FLException{
		
		workerSalaryService.payWorkerSalary(workerSalary, queryUserId(), queryCompany());
		
		return SUCCESS;
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

	public String getSourceId() {
		return sourceId;
	}

	public void setSourceId(String sourceId) {
		this.sourceId = sourceId;
	}

	public String getTargetId() {
		return targetId;
	}

	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}


}

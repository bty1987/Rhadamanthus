package com.fanglin.salary.action;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
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
  
  @Action(value="pageWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String pageWorkerSalary() throws FLException{
	  
	  workerSalaryService.pageWorkerSalary(getPaging(), getFilters(), queryCompany());
    
    return "success";
  }
  
  @Action(value="queryWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String queryWorkerSalary() throws FLException{
	  
	  workerSalarys = this.workerSalaryService.queryWorkerSalary(this.workerSalary);
    
    return "success";
  }
  
  @Action(value="addWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String addWorkerSalary() throws FLException{
	  
	  workerSalaryService.addWorkerSalary(this.workerSalary, queryUserId());
    
    return "success";
  }
  
  @Action(value="updateWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String updateWorkerSalary()throws FLException{
	  
	  workerSalaryService.updateWorkerSalary(this.workerSalary);
    
    return "success";
  }
  
  @Action(value="adoptWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String adoptWorkerSalary() throws FLException{
	  
	  workerSalaryService.adoptWorkerSalary(this.workerSalarys, queryUserId());
    
    return "success";
  }
  
  @Action(value="rejectWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String rejectWorkerSalary()throws FLException{
	  
	  workerSalaryService.rejectWorkerSalary(this.workerSalarys, queryUserId());
    
    return "success";
  }
  
  @Action(value="deleteWorkerSalary", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
  public String deleteWorkerSalary()throws FLException{
	  
	  workerSalaryService.deleteWorkerSalary(this.workerSalary);
    
    return "success";
  }
  
  public WorkerSalaryVO getWorkerSalary()
  {
    return this.workerSalary;
  }
  
  public void setWorkerSalary(WorkerSalaryVO workerSalary)
  {
    this.workerSalary = workerSalary;
  }
  
  public List<WorkerSalaryVO> getWorkerSalarys()
  {
    return this.workerSalarys;
  }
  
  public void setWorkerSalarys(List<WorkerSalaryVO> workerSalarys)
  {
    this.workerSalarys = workerSalarys;
  }
}

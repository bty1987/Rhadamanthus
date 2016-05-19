/**
 * @File Name		: WorkerSalaryAction.java
 * @Package   	: com.fanglin.action.salary
 * @Version		: 1.0
 * @Date			: 2014-10-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.WorkerBaseSalaryService;
import com.fanglin.salary.service.WorkerDeductSalaryService;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerBaseSalaryVO;
import com.fanglin.salary.vo.WorkerDeductSalaryVO;
import com.fanglin.salary.vo.WorkerSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerSalaryAction extends BaseListAction{

	private static final long serialVersionUID = -3123695680902059648L;
	
	@Autowired
	private WorkerSalaryService workerSalaryService;
	
	@Autowired
	private WorkerBaseSalaryService workerBaseSalaryService;
	
	@Autowired
	private WorkerDeductSalaryService workerDeductSalaryService;
	
	private WorkerSalaryVO workerSalary;
	
	private WorkerBaseSalaryVO workerBaseSalary;
	
	private WorkerDeductSalaryVO workerDeductSalary;
	
	private List<WorkerBaseSalaryVO> workBaseSalarys;
	
	private List<WorkerDeductSalaryVO> workerDeductSalarys;
	
	private List<Integer> wbsIds;
	
	private List<Integer> wdsIds;
	
	@Action(value="pageWorkerSalaryForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerSalaryForInit(){
		
		workerSalaryService.pageWorkerSalaryForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerSalaryForPayOff", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerSalaryForPayOff(){
		
		workerSalaryService.pageWorkerSalaryForPayOff(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerSalaryForUnPayOff", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerSalaryForUnPayOff(){
		
		workerSalaryService.pageWorkerSalaryForUnPayOff(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerBaseSalary(){
		
		workerBaseSalaryService.pageWorkerBaseSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerBaseSalaryByOrderIdAUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerBaseSalaryByOrderIdAUserId() throws FLException{
		
		workerBaseSalaryService.pageWorkerBaseSalaryByOrderIdAUserId(getPaging(), getFilters(), workerBaseSalary, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerBaseSalaryForPass", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerBaseSalaryForPass(){
		
		workerBaseSalaryService.pageWorkerBaseSalaryForPass(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerDeductSalaryByOrderIdAUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerDeductSalaryByOrderIdAUserId() throws FLException{
		
		workerDeductSalaryService.pageWorkerDeductSalaryByOrderIdAUserId(getPaging(), getFilters(), workerDeductSalary, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageWorkerDeductSalaryForPersonal", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerDeductSalaryForPersonal(){
		
		workerDeductSalaryService.pageWorkerDeductSalaryForPersonal(getPaging(), getFilters(), workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="queryWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryWorkerBaseSalary(){
		
		workBaseSalarys = workerBaseSalaryService.queryWorkerBaseSalaryByOrder(workerBaseSalary);
		
		return SUCCESS;
	}
	
	@Action(value="payWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String payWorkerSalary(){
		
		workerSalaryService.payoffWorkerSalary();
		
		return SUCCESS;
	}
	
	@Action(value="payoffWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String payoffWorkerSalary(){
		
		workerSalaryService.payoffWorkerSalary(workerSalary);
		
		return SUCCESS;
	}
	
	@Action(value="unPayoffWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String unPayoffWorkerSalary(){
		
		workerSalaryService.unPayoffWorkerSalary(workerSalary);
		
		return SUCCESS;
	}
	
	@Action(value="addWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addWorkerBaseSalary() throws FLException{
		
		workerBaseSalaryService.addWorkerBaseSalary(workerBaseSalary, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="addWorkerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addWorkerDeductSalary(){
		
		workerDeductSalaryService.addWorderDeductSalary(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="updateWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateWorkerBaseSalary(){
		
		workerBaseSalaryService.updateWorkerBaseSalary(workerBaseSalary);
		
		return SUCCESS;
	}
	
	@Action(value="updateWorkerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateWorkerDeductSalary(){
		
		workerDeductSalaryService.updateWorderDeductSalary(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="passWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String passWorkerBaseSalary() throws FLException{
		
		workerBaseSalaryService.passWorkerBaseSalary(workerBaseSalary, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="passWorkerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String passWorkerDeductSalary(){
		
		workerDeductSalaryService.passWorderDeductSalary(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="confirmWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String confirmWorkerBaseSalary(){
		
		workerBaseSalaryService.confirmWorkerBaseSalary(workerBaseSalary);
		
		return SUCCESS;
	}
	
	@Action(value="confirmWorkerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String confirmWorkerDeductSalary(){
		
		workerDeductSalaryService.confirmWorkerDeductSalary(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="cancelWorkerBaseSalaryToInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelWorkerBaseSalaryToInit() throws FLException{
		
		workerBaseSalaryService.cancelWorkerBaseSalaryToInit(workerBaseSalary, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="cancelWorkerDeductSalaryToInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelWorkerDeductSalaryToInit(){
		
		workerDeductSalaryService.cancelWorkerDeductSalaryToInit(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="cancelWorkerBaseSalaryToConfirm", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelWorkerBaseSalaryToConfirm(){
		
		workerBaseSalaryService.cancelWorkerBaseSalaryToConfirm(workerBaseSalary);
		
		return SUCCESS;
	}
	
	@Action(value="cancelWorkerDeductSalaryToConfirm", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelWorkerDeductSalaryToConfirm(){
		
		workerDeductSalaryService.cancelWorkerDeductSalaryToConfirm(workerDeductSalary);
		
		return SUCCESS;
	}
	
	@Action(value="deleteWorkerBaseSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteWorkerBaseSalary() throws FLException{
		
		int flag = workerBaseSalaryService.deleteWorkerBaseSalarys(wbsIds);
		
		if(flag == 1){
			throw new FLException(220004, "工人工资删除中,存在财务确认");
		}
		
		return SUCCESS;
	}
	
	@Action(value="deleteWorkerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteWorkerDeductSalary() throws FLException{
		
		int flag = workerDeductSalaryService.deleteWorkerDeductSalarys(wdsIds);
		
		if(flag == 1){
			throw new FLException(220004, "工人工资删除中,存在财务确认");
		}
		
		return SUCCESS;
	}
	
	public WorkerBaseSalaryVO getWorkerBaseSalary(){
		return workerBaseSalary;
	}

	public void setWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalary){
		this.workerBaseSalary = workerBaseSalary;
	}

	public List<WorkerBaseSalaryVO> getWorkBaseSalarys(){
		return workBaseSalarys;
	}

	public void setWorkBaseSalarys(List<WorkerBaseSalaryVO> workBaseSalarys){
		this.workBaseSalarys = workBaseSalarys;
	}

	public List<Integer> getWbsIds(){
		return wbsIds;
	}

	public void setWbsIds(List<Integer> wbsIds){
		this.wbsIds = wbsIds;
	}

	public WorkerDeductSalaryVO getWorkerDeductSalary(){
		return workerDeductSalary;
	}

	public void setWorkerDeductSalary(WorkerDeductSalaryVO workerDeductSalary){
		this.workerDeductSalary = workerDeductSalary;
	}

	public List<WorkerDeductSalaryVO> getWorkerDeductSalarys(){
		return workerDeductSalarys;
	}

	public void setWorkerDeductSalarys(
			List<WorkerDeductSalaryVO> workerDeductSalarys){
		this.workerDeductSalarys = workerDeductSalarys;
	}

	public List<Integer> getWdsIds(){
		return wdsIds;
	}

	public void setWdsIds(List<Integer> wdsIds){
		this.wdsIds = wdsIds;
	}

	public WorkerSalaryVO getWorkerSalary(){
		return workerSalary;
	}

	public void setWorkerSalary(WorkerSalaryVO workerSalary){
		this.workerSalary = workerSalary;
	}
}


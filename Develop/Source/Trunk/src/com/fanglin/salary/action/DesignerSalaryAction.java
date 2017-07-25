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
import com.fanglin.salary.service.DesignerSalaryService;
import com.fanglin.salary.vo.DesignerSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DesignerSalaryAction  extends BaseListAction{


	private static final long serialVersionUID = -2158654624555009996L;
	@Autowired
	private  DesignerSalaryService  designerSalaryService;
	
	private List<DesignerSalaryVO>   designerSalarys;
	
	private DesignerSalaryVO  designerSalary; 
	
	@Action(value = "pageDesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageDesignerSalarys (){
	
		designerSalaryService.pagedesignerSalary(getPaging(), getFilters());
		
		return  SUCCESS;
	}
	
	@Action(value = "adddesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String adddesignerSalary() throws FLException{
		
		designerSalaryService.adddesignerSalary(designerSalary,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updatedesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkerSalary() throws FLException{
		
		designerSalaryService.updatedesignerSalary(designerSalary);
		
		return SUCCESS;
	}
	
	@Action(value = "adoptdesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String adoptWorkerSalary() throws FLException{
		
		designerSalaryService.adoptdesignerSalary(designerSalarys,queryUserId());
			
		return SUCCESS;
			}
	
	@Action(value = "rejectdesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectdesignerSalary() throws FLException{
		
		designerSalaryService.rejectdesignerSalary(designerSalarys,queryUserId());
			
		return SUCCESS;
			}
	
	@Action(value = "deletedesignerSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String deletedesignerSalary () throws FLException{
	
		designerSalaryService.deletedesignerSalary(designerSalary);
		
		return  SUCCESS;
	}

	public List<DesignerSalaryVO> getDesignerSalarys() {
		return designerSalarys;
	}

	public void setDesignerSalarys(List<DesignerSalaryVO> designerSalarys) {
		this.designerSalarys = designerSalarys;
	}

	public DesignerSalaryVO getDesignerSalary() {
		return designerSalary;
	}

	public void setDesignerSalary(DesignerSalaryVO designerSalary) {
		this.designerSalary = designerSalary;
	}
	
}

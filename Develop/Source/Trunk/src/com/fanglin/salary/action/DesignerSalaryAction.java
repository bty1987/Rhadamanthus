/**
 * @File Name		: DesignerSalaryAction.java
 * @Package   	: com.fanglin.action.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.salary.service.DesignerDeductSalaryService;
import com.fanglin.salary.service.DesignerOutsideSalaryService;
import com.fanglin.salary.service.DesignerPostBalanceSalaryService;
import com.fanglin.salary.service.DesignerPreBalanceSalaryService;
import com.fanglin.salary.service.DesignerSalaryService;
import com.fanglin.salary.vo.DesignerPostBalanceSalaryVO;
import com.fanglin.salary.vo.DesignerPreBalanceSalaryVO;
import com.fanglin.salary.vo.DesignerSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DesignerSalaryAction extends BaseListAction{

	private static final long serialVersionUID = 416674828988661973L;
	
	@Autowired
	private DesignerSalaryService designerSalaryService;
	
	@Autowired
	private DesignerPreBalanceSalaryService designerPreBalanceSalaryService;
	
	@Autowired
	private DesignerPostBalanceSalaryService designerPostBalanceSalaryService;
	
	@Autowired
	private DesignerOutsideSalaryService designerOutsideSalaryService;
	
	@Autowired
	private DesignerDeductSalaryService designerDeductSalaryService;
	
	private DesignerSalaryVO designerSalary;

	private DesignerPreBalanceSalaryVO designerPreBalanceSalary;
	
	private DesignerPostBalanceSalaryVO designerPostBalanceSalary;
	
	@Action(value="pageDesignerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerSalary(){
		
		designerSalaryService.pageDesignerSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerSalaryForInit", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerSalaryForInit(){
		
		designerSalaryService.pageDesignerSalaryForInit(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerSalaryForPayOff", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerSalaryForPayOff(){
		
		designerSalaryService.pageDesignerSalaryForPayOff(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerSalaryByUnPayOff", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerSalaryByUnPayOff(){
		
		designerSalaryService.pageDesignerSalaryForUnPayOff(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerPreBalanceSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerPreBalanceSalary(){
		
		designerPreBalanceSalaryService.pageDesignerPreBalanceSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerPostBalanceSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerPostBalanceSalary(){
		
		designerPostBalanceSalaryService.pageDesignerPostBalanceSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerOutsideSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerOutsideSalary(){
		
		designerOutsideSalaryService.pageDesignerOutsideSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageDesignerDeductSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageDesignerDeductSalary(){
		
		designerDeductSalaryService.pageDesignerDeductSalary(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="payDesignerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String payDesignerSalary(){
		
		designerSalaryService.payDesignerSalary();
		
		return SUCCESS;
	}
	
	@Action(value="payoffDesignerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String payoffDesignerSalary(){
		
		designerSalaryService.payoffDesignerSalary(designerSalary);
		
		return SUCCESS;
	}
	
	@Action(value="unpayoffDesignerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String unpayoffDesignerSalary(){
		
		designerSalaryService.unpayoffDesignerSalary(designerSalary);
		
		return SUCCESS;
	}
	
	public DesignerPreBalanceSalaryVO getDesignerPreBalanceSalary() {
		return designerPreBalanceSalary;
	}

	public void setDesignerPreBalanceSalary(
			DesignerPreBalanceSalaryVO designerPreBalanceSalary) {
		this.designerPreBalanceSalary = designerPreBalanceSalary;
	}

	public DesignerPostBalanceSalaryVO getDesignerPostBalanceSalary() {
		return designerPostBalanceSalary;
	}

	public void setDesignerPostBalanceSalary(
			DesignerPostBalanceSalaryVO designerPostBalanceSalary) {
		this.designerPostBalanceSalary = designerPostBalanceSalary;
	}

	public DesignerSalaryVO getDesignerSalary() {
		return designerSalary;
	}

	public void setDesignerSalary(DesignerSalaryVO designerSalary) {
		this.designerSalary = designerSalary;
	}
	
}

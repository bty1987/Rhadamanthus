/**
 * @File Name		: InspectionDeductionAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.InspectionDeductionService;
import com.fanglin.construction.vo.InspectionDeductionVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InspectionDeductionAction extends BaseListAction{

	private static final long serialVersionUID = 3435128983660391287L;
	
	@Autowired
	private InspectionDeductionService inspectionDeductionService;
	
	private InspectionDeductionVO inspectionDeduction;
	
	private List<String> idIds;
	
	@Action(value = "pageInspectionDeductionByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageInspectionDeductionByOrderId(){
		
		inspectionDeductionService.pageInspectionDeductionByOrderId(getPaging(), getFilters(), inspectionDeduction);
		
		return SUCCESS;
	}
	
	@Action(value = "addInspectionDeduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInspectionDeduction(){
		
		inspectionDeductionService.saveOrUpdateInspectionDeduction(inspectionDeduction);
		
		return SUCCESS;
	}
	
	@Action(value = "updateInspectionDeduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInspectionDeduction(){
		
		inspectionDeductionService.updateInspectionDeduction(inspectionDeduction);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteInspectionDeduction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteInspectionDeduction(){
		
		inspectionDeductionService.deleteInspectionRecords(idIds);
		
		return SUCCESS;
	}

	public InspectionDeductionVO getInspectionDeduction(){
		return inspectionDeduction;
	}

	public void setInspectionDeduction(InspectionDeductionVO inspectionDeduction){
		this.inspectionDeduction = inspectionDeduction;
	}

	public List<String> getIdIds(){
		return idIds;
	}

	public void setIdIds(List<String> idIds){
		this.idIds = idIds;
	}
	
}
/**
 * @File Name		: MaterialRankAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.MaterialRankService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialRankAction extends BaseListAction {

	private static final long serialVersionUID = -1839299373400611938L;
	
	@Autowired
	private MaterialRankService materialRankService;
	
	private List<?> ranks;
	
	@Action(value="queryMaterialDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialDesignerRank(){
		
		ranks = materialRankService.queryMaterialDesignerRankForTop(-1);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialDesignerDepartmentRank() throws FLException{
		
		ranks = materialRankService.queryMaterialDesignerDepartmentRankForTop(getUserId(), -1);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialDesignerRegionRank() throws FLException{
		
		ranks = materialRankService.queryMaterialDesignerRegionRankForTop(getUserId(), -1);
		
		return SUCCESS;
	}
	
	@Action(value="materialDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialDesignerRank(){
		
		ranks = materialRankService.queryMaterialDesignerRankForTop(10);
		
		return SUCCESS;
	}
	
	@Action(value="materialDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialDesignerDepartmentRank() throws FLException{
		
		ranks = materialRankService.queryMaterialDesignerDepartmentRankForTop(getUserId(), 10);
		
		return SUCCESS;
	}
	
	@Action(value="materialDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String materialDesignerRegionRank() throws FLException{
		
		ranks = materialRankService.queryMaterialDesignerRegionRankForTop(getUserId(), 10);
		
		return SUCCESS;
	}
	
	@Action(value="queryZaterialDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryZaterialDesignerRank(){
		
		ranks = materialRankService.queryZaterialDesignerRankForTop(-1);
		
		return SUCCESS;
	}
	
	@Action(value="queryZaterialDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryZaterialDesignerDepartmentRank() throws FLException{
		
		ranks = materialRankService.queryZaterialDesignerDepartmentRankForTop(getUserId(), -1);
		
		return SUCCESS;
	}
	
	@Action(value="queryZaterialDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryZaterialDesignerRegionRank() throws FLException{
		
		ranks = materialRankService.queryZaterialDesignerRegionRankForTop(getUserId(), -1);
		
		return SUCCESS;
	}
	
	@Action(value="zaterialDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String zaterialDesignerRank(){
		
		ranks = materialRankService.queryZaterialDesignerRankForTop(10);
		
		return SUCCESS;
	}
	
	@Action(value="zaterialDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String zaterialDesignerDepartmentRank() throws FLException{
		
		ranks = materialRankService.queryZaterialDesignerDepartmentRankForTop(getUserId(), 10);
		
		return SUCCESS;
	}
	
	@Action(value="zaterialDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String zaterialDesignerRegionRank() throws FLException{
		
		ranks = materialRankService.queryZaterialDesignerRegionRankForTop(getUserId(), 10);
		
		return SUCCESS;
	}

	public List<?> getRanks(){
		return ranks;
	}

	public void setRanks(List<?> ranks){
		this.ranks = ranks;
	}

}

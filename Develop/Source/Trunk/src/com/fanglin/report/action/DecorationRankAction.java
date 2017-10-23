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
import com.fanglin.report.service.DecorationRankService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationRankAction extends BaseListAction {

	private static final long serialVersionUID = 3985855196344696431L;
	
	@Autowired
	private DecorationRankService decorationRankService;
	
	private List<?> ranks;
	
	@Action(value="queryDecorationDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationDesignerRank()throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerRankForTop(-1,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationDesignerDepartmentRank() throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerDepartmentRankForTop(queryUserId(), -1,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryDecorationDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDecorationDesignerRegionRank() throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerRegionRankForTop(queryUserId(), -1,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="decorationDesignerRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String decorationDesignerRank()throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerRankForTop(10,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="decorationDesignerDepartmentRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String decorationDesignerDepartmentRank() throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerDepartmentRankForTop(queryUserId(), 10,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="decorationDesignerRegionRank", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String decorationDesignerRegionRank() throws FLException{
		
		ranks = decorationRankService.queryDecorationDesignerRegionRankForTop(queryUserId(), 10,queryCompany());
		
		return SUCCESS;
	}
	
	public List<?> getRanks(){
		return ranks;
	}

	public void setRanks(List<?> ranks){
		this.ranks = ranks;
	}

}

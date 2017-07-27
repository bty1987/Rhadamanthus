package com.fanglin.data.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.construction.service.ConstructionNodeService;
import com.fanglin.data.construction.vo.ConstructionNodeCompanyVO;
import com.fanglin.data.construction.vo.ConstructionNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionNodeAction extends BaseListAction {

	private static final long serialVersionUID = 369283426907698981L;
	
	@Autowired
	private ConstructionNodeService constructionNodeService;
	
	private ConstructionNodeVO constructionNode;
	
	private List<ConstructionNodeVO> constructionNodes;
	
	private ConstructionNodeCompanyVO constructionNodeCompany;
	
	private List<Long> cnids;
	
	@Action(value = "pageConstructionNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionNode(){
		
		constructionNodeService.pageConstructionNode(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionNode(){
		
		constructionNodes = constructionNodeService.queryConstructionNode(constructionNode);
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionNodeByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionNodeByCid(){
		
		constructionNodes = constructionNodeService.queryConstructionNodeByCid(constructionNodeCompany);
		
		return SUCCESS;
	}
	
	public ConstructionNodeService getConstructionNodeService() {
		return constructionNodeService;
	}

	public void setConstructionNodeService(ConstructionNodeService constructionNodeService) {
		this.constructionNodeService = constructionNodeService;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public List<ConstructionNodeVO> getConstructionNodes() {
		return constructionNodes;
	}

	public void setConstructionNodes(List<ConstructionNodeVO> constructionNodes) {
		this.constructionNodes = constructionNodes;
	}

	public ConstructionNodeCompanyVO getConstructionNodeCompany() {
		return constructionNodeCompany;
	}

	public void setConstructionNodeCompany(
			ConstructionNodeCompanyVO constructionNodeCompany) {
		this.constructionNodeCompany = constructionNodeCompany;
	}

	public List<Long> getCnids() {
		return cnids;
	}

	public void setCnids(List<Long> cnids) {
		this.cnids = cnids;
	}
	
}

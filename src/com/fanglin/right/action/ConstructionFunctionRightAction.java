package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.ConstructionFunctionRightService;
import com.fanglin.right.vo.ConstructionFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 6788183414191506160L;

	@Autowired
	private ConstructionFunctionRightService constructionFunctionRightService;

	private List<ConstructionFunctionRightVO> constructionFunctionRights;

	private ConstructionFunctionRightVO constructionFunctionRight;

	private List<String> companys;

	private List<Long> cfids;

	@Action(value = "queryConstructionFunctionRightByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionFunctionRightByName() throws FLException {

		constructionFunctionRights = constructionFunctionRightService.queryConstructionFunctionRightByName(constructionFunctionRight, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionFunctionRight() throws FLException {

		constructionFunctionRightService.updateConstructionFunctionRight(constructionFunctionRight, cfids, queryCompany());

		return SUCCESS;
	}

	@Action(value = "syncConstructionFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncConstructionFunctionRight() throws FLException {

		constructionFunctionRightService.syncConstructionFunctionRight(constructionFunctionRight, companys, queryCompany());

		return SUCCESS;
	}

	public List<ConstructionFunctionRightVO> getConstructionFunctionRights() {
		return constructionFunctionRights;
	}

	public void setConstructionFunctionRights(List<ConstructionFunctionRightVO> constructionFunctionRights) {
		this.constructionFunctionRights = constructionFunctionRights;
	}

	public ConstructionFunctionRightVO getConstructionFunctionRight() {
		return constructionFunctionRight;
	}

	public void setConstructionFunctionRight(ConstructionFunctionRightVO constructionFunctionRight) {
		this.constructionFunctionRight = constructionFunctionRight;
	}

	public List<Long> getCfids() {
		return cfids;
	}

	public void setCfids(List<Long> cfids) {
		this.cfids = cfids;
	}

	public List<String> getCompanys() {
		return companys;
	}

	public void setCompanys(List<String> companys) {
		this.companys = companys;
	}

}

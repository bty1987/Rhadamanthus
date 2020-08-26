package com.fanglin.construction.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionInfoAction extends BaseListAction {

	private static final long serialVersionUID = 369283426907698980L;

	@Autowired
	private ConstructionInfoService constructionInfoService;

	private ConstructionInfoVO constructionInfo;
	
	@Action(value = "pageConstructionInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionInfo() throws FLException {

		constructionInfoService.pageConstructionInfo(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionInfo() throws FLException {

		constructionInfo = constructionInfoService.queryConstructionInfo(constructionInfo);

		return SUCCESS;
	}

	@Action(value = "updateConstructionInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionInfo() throws FLException {

		constructionInfoService.updateConstructionInfo(constructionInfo);

		return SUCCESS;
	}

	@Action(value = "queryConstructionInfoByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionInfoByOrderId() throws FLException {

		constructionInfo = constructionInfoService.queryConstructionInfoByOrderId(constructionInfo);

		return SUCCESS;
	}

	@Action(value = "updateConstructionInfoByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionInfoByOrderId() throws FLException {

		constructionInfoService.updateConstructionInfoByOrderId(constructionInfo);

		return SUCCESS;
	}
	
	public ConstructionInfoVO getConstructionInfo() {
		return constructionInfo;
	}

	public void setConstructionInfo(ConstructionInfoVO constructionInfo) {
		this.constructionInfo = constructionInfo;
	}
}

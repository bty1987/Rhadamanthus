package com.fanglin.data.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.ConstructionPeriodService;
import com.fanglin.data.common.vo.ConstructionPeriodVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionPeriodAction extends BaseListAction {

	private static final long serialVersionUID = 8003189076507457677L;

	@Autowired
	private ConstructionPeriodService constructionPeriodService;

	private ConstructionPeriodVO constructionPeriod;

	@Action(value = "pageConstructionPeriod", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionPeriod() throws FLException {

		constructionPeriodService.pageConstructionPeriod(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionPeriod", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPeriod() throws FLException {

		constructionPeriod = constructionPeriodService.queryConstructionPeriod(constructionPeriod, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addConstructionPeriod", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPeriod() throws FLException {

		constructionPeriodService.addConstructionPeriod(constructionPeriod, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionPeriod", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPeriod() throws FLException {

		constructionPeriodService.updateConstructionPeriod(constructionPeriod);

		return SUCCESS;
	}

	@Action(value = "deleteConstructionPeriod", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionPeriod() throws FLException {

		constructionPeriodService.deleteConstructionPeriod(constructionPeriod);

		return SUCCESS;
	}

	public ConstructionPeriodVO getConstructionPeriod() {
		return constructionPeriod;
	}

	public void setConstructionPeriod(ConstructionPeriodVO constructionPeriod) {
		this.constructionPeriod = constructionPeriod;
	}

}

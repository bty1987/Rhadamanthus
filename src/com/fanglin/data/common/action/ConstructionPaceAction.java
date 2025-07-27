package com.fanglin.data.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.ConstructionPaceService;
import com.fanglin.data.common.vo.ConstructionPaceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionPaceAction extends BaseListAction {

	private static final long serialVersionUID = 8003189076507457677L;

	@Autowired
	private ConstructionPaceService constructionPaceService;

	private ConstructionPaceVO constructionPace;

	@Action(value = "pageConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionPace() throws FLException {

		constructionPaceService.pageConstructionPace(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPace() throws FLException {

		constructionPace = constructionPaceService.queryConstructionPace(constructionPace, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPace() throws FLException {

		constructionPaceService.addConstructionPace(constructionPace, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPace() throws FLException {

		constructionPaceService.updateConstructionPace(constructionPace);

		return SUCCESS;
	}

	@Action(value = "deleteConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionPace() throws FLException {

		constructionPaceService.deleteConstructionPace(constructionPace);

		return SUCCESS;
	}

	public ConstructionPaceVO getConstructionPace() {
		return constructionPace;
	}

	public void setConstructionPace(ConstructionPaceVO constructionPace) {
		this.constructionPace = constructionPace;
	}

}

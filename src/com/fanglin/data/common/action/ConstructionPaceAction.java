package com.fanglin.data.common.action;

import java.util.List;

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

	private static final long serialVersionUID = 9131310035331362798L;

	@Autowired
	private ConstructionPaceService constructionPaceService;

	private List<ConstructionPaceVO> constructionPaces;

	private ConstructionPaceVO constructionPace;

	@Action(value = "pageConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionPace() {

		constructionPaceService.pageConstructionPace(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPace() {

		constructionPaces = constructionPaceService.queryConstructionPace();

		return SUCCESS;
	}

	@Action(value = "addConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPace() throws FLException {

		constructionPaceService.addConstructionPace(constructionPace);

		return SUCCESS;
	}

	@Action(value = "updateConstructionPace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPace() throws FLException {

		constructionPaceService.updateConstructionPace(constructionPace);

		return SUCCESS;
	}

	@Action(value = "updateConstructionPaceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPaceForStatus() throws FLException {

		constructionPaceService.updateConstructionPaceForStatus(constructionPace);

		return SUCCESS;
	}

	public List<ConstructionPaceVO> getConstructionPaces() {
		return constructionPaces;
	}

	public void setConstructionPaces(List<ConstructionPaceVO> constructionPaces) {
		this.constructionPaces = constructionPaces;
	}

	public ConstructionPaceVO getConstructionPace() {
		return constructionPace;
	}

	public void setConstructionPace(ConstructionPaceVO constructionPace) {
		this.constructionPace = constructionPace;
	}

}

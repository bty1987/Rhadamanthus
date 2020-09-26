package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.McategoryService;
import com.fanglin.store.vo.McategoryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class McategoryAction extends BaseListAction {

	private static final long serialVersionUID = 6606006629580300464L;

	@Autowired
	private McategoryService mcategoryService;

	private McategoryVO mcategory;

	@Action(value = "pageMcategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMcategory() {

		mcategoryService.pageMcategory(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addMcategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMcategory() throws FLException {

		mcategoryService.addMcategory(mcategory);

		return SUCCESS;
	}

	@Action(value = "updateMcategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMcategory() throws FLException {

		mcategoryService.updateMcategory(mcategory);

		return SUCCESS;
	}

	@Action(value = "updateMcategoryForShow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMcategoryForShow() throws FLException {

		mcategoryService.updateMcategoryForShow(mcategory);

		return SUCCESS;
	}

	public McategoryVO getMcategory() {
		return mcategory;
	}

	public void setMcategory(McategoryVO mcategory) {
		this.mcategory = mcategory;
	}

}

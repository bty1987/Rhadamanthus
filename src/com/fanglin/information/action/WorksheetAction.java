package com.fanglin.information.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.WorksheetService;
import com.fanglin.information.vo.WorksheetVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorksheetAction extends BaseListAction {

	private static final long serialVersionUID = 5861898517086836202L;

	@Autowired
	private WorksheetService worksheetService;

	private WorksheetVO worksheet;

	@Action(value = "pageWorksheet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWorksheet() throws FLException {

		worksheetService.pageWorksheet(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addWorksheet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorksheet() throws FLException {

		worksheetService.addWorksheet(worksheet, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "cancelWorksheet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelWorksheet() throws FLException {

		worksheetService.cancelWorksheet(worksheet, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleWorksheet", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleWorksheet() throws FLException {

		worksheetService.handleWorksheet(worksheet, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public WorksheetVO getWorksheet() {
		return worksheet;
	}

	public void setWorksheet(WorksheetVO worksheet) {
		this.worksheet = worksheet;
	}

}

package com.fanglin.report.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.UserReportService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserReportAction extends BaseListAction {

	private static final long serialVersionUID = -7824868059103878676L;
	@Autowired
	private UserReportService userReportService;

	@Action(value = "queryUser7Achievement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryUser7Achievement() throws FLException {

		userReportService.queryUser7Achievement(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

}

package com.fanglin.report.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.SalesReportService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesReportAction extends BaseListAction {

	private static final long serialVersionUID = 4928938676396392563L;
	@Autowired
	private SalesReportService salesReportService;

	@Action(value = "querySales7Achievement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySales7Achievement() throws FLException {

		salesReportService.querySales7Achievement(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

}

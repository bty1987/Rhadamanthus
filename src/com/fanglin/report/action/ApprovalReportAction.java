package com.fanglin.report.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.ApprovalReportService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalReportAction extends BaseListAction {

	private static final long serialVersionUID = 3623437332132327302L;
	
	@Autowired
	private ApprovalReportService approvalReportService;

	@Action(value = "queryApproval7Achievement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApproval7Achievement() throws FLException {

		approvalReportService.queryApproval7Achievement(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

}

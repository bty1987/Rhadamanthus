package com.fanglin.report.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.DecorationReportService;
import com.fanglin.report.vo.DecorationAchievementVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationReportAction extends BaseListAction {

	private static final long serialVersionUID = -7744015303306070932L;

	@Autowired
	private DecorationReportService decorationReportService;

	private DecorationAchievementVO decorationAchievement;

	@Action(value = "queryDecoration7Construction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecoration7Construction() throws FLException {

		decorationReportService.queryDecoration7Construction(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryDecoration7Achievement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecoration7Achievement() throws FLException {

		decorationReportService.queryDecoration7Achievement(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updataDecoration7Construction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updataDecoration7Construction() throws Exception {

		decorationReportService.updataDecoration7Construction();

		return SUCCESS;
	}

	@Action(value = "updataDecoration7Achievement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updataDecoration7Achievement() throws Exception {

		decorationReportService.updataDecoration7Achievement(decorationAchievement, queryCompany());

		return SUCCESS;
	}

	public DecorationAchievementVO getDecorationAchievement() {
		return decorationAchievement;
	}

	public void setDecorationAchievement(DecorationAchievementVO decorationAchievement) {
		this.decorationAchievement = decorationAchievement;
	}

}

package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.SurveyService;
import com.fanglin.customer.vo.SurveyVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class SurveyAction extends BaseListAction {

	private static final long serialVersionUID = -7035676388129869651L;

	@Autowired
	private SurveyService surveyService;

	private SurveyVO survey;

	private List<SurveyVO> surveys;

	@Action(value = "pageSurvey", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSurvey() throws FLException {

		surveyService.pageSurvey(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "querySurveyByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySurveyByOrderId() throws FLException {

		surveys = surveyService.querySurveyByOrderId(survey);

		return SUCCESS;
	}

	@Action(value = "querySurveyBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySurveyBySid() throws FLException {

		survey = surveyService.querySurveyBySid(survey);

		return SUCCESS;
	}

	@Action(value = "sendSurvey", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendSurvey() throws FLException {

		surveyService.sendSurvey(survey);

		return SUCCESS;
	}

	@Action(value = "makeSurvey", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeSurvey() throws FLException {

		surveyService.makeSurvey(survey, queryUserId());

		return SUCCESS;
	}

	@Action(value = "handleSurvey", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleSurvey() throws FLException {

		surveyService.handleSurvey(survey);

		return SUCCESS;
	}

	public SurveyVO getSurvey() {
		return survey;
	}

	public void setSurvey(SurveyVO survey) {
		this.survey = survey;
	}

	public List<SurveyVO> getSurveys() {
		return surveys;
	}

	public void setSurveys(List<SurveyVO> surveys) {
		this.surveys = surveys;
	}

}

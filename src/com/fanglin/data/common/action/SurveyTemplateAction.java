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
import com.fanglin.data.common.service.SurveyTemplateService;
import com.fanglin.data.common.vo.SurveyTemplateVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SurveyTemplateAction extends BaseListAction {

	private static final long serialVersionUID = -8112581171039921146L;

	@Autowired
	private SurveyTemplateService surveyTemplateService;

	private SurveyTemplateVO surveyTemplate;

	private List<SurveyTemplateVO> surveyTemplates;

	@Action(value = "pageSurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSurveyTemplate() throws FLException {

		surveyTemplateService.pageSurveyTemplate(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySurveyTemplate() throws FLException {

		if (surveyTemplate == null) surveyTemplate = new SurveyTemplateVO();

		surveyTemplates = surveyTemplateService.querySurveyTemplate(surveyTemplate, queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySurveyTemplateByStid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySurveyTemplateByStid() throws FLException {

		surveyTemplate = surveyTemplateService.querySurveyTemplateByStid(surveyTemplate);

		return SUCCESS;
	}

	@Action(value = "addSurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSurveyTemplate() throws FLException {

		surveyTemplateService.addSurveyTemplate(surveyTemplate, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSurveyTemplate() throws FLException {

		surveyTemplateService.updateSurveyTemplate(surveyTemplate);

		return SUCCESS;
	}

	@Action(value = "updateSurveyTemplateForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSurveyTemplateForStatus() throws FLException {

		surveyTemplateService.updateSurveyTemplateForStatus(surveyTemplate);

		return "success";
	}

	@Action(value = "deleteSurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSurveyTemplate() throws FLException {

		surveyTemplateService.deleteSurveyTemplate(surveyTemplate);

		return SUCCESS;
	}

	@Action(value = "copySurveyTemplate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copySurveyTemplate() throws FLException {

		surveyTemplateService.copySurveyTemplate(surveyTemplate, queryCompany());

		return SUCCESS;
	}

	public SurveyTemplateVO getSurveyTemplate() {
		return surveyTemplate;
	}

	public void setSurveyTemplate(SurveyTemplateVO surveyTemplate) {
		this.surveyTemplate = surveyTemplate;
	}

	public List<SurveyTemplateVO> getSurveyTemplates() {
		return surveyTemplates;
	}

	public void setSurveyTemplates(List<SurveyTemplateVO> surveyTemplates) {
		this.surveyTemplates = surveyTemplates;
	}

}

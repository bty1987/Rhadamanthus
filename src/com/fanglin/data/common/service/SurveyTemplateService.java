package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.SurveyTemplateVO;
import com.fanglin.utils.Paging;

public interface SurveyTemplateService {

	public void pageSurveyTemplate(Paging paging, List<Filter> filters, int queryCompany);

	public List<SurveyTemplateVO> querySurveyTemplate(SurveyTemplateVO surveyTemplate);

	public SurveyTemplateVO querySurveyTemplateByStid(SurveyTemplateVO surveyTemplate);

	public int addSurveyTemplate(SurveyTemplateVO surveyTemplate, int company);

	public void updateSurveyTemplate(SurveyTemplateVO surveyTemplate) throws FLException;

	public int deleteSurveyTemplate(SurveyTemplateVO surveyTemplate) throws FLException;

}

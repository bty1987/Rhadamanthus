package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.utils.Paging;

public interface SurveyService {

	public void pageSurvey(Paging paging, List<Filter> filters);

	public List<SurveyVO> querySurveyByOrderId(SurveyVO surveyVO);

	public SurveyVO querySurveyBySid(SurveyVO surveyVO);

	public int sendSurvey(SurveyVO surveyVO);

	public int makeSurvey(SurveyVO surveyVO, String userId);

	public void handleSurvey(SurveyVO surveyVO);
}

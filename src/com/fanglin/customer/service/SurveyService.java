package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.utils.Paging;

public interface SurveyService {

	public void pageSurvey(Paging paging, List<Filter> filters, int company);

	public List<SurveyVO> querySurveyByOrderId(SurveyVO surveyVO);

	public SurveyVO querySurveyBySid(SurveyVO surveyVO) throws FLException;

	public int sendSurvey(SurveyVO surveyVO, String userId) throws FLException;

	public int makeSurvey(SurveyVO surveyVO, String userId, int company) throws FLException;

	public void handleSurvey(SurveyVO surveyVO) throws FLException;

	public void finishSurvey(SurveyVO surveyVO, String userId) throws FLException;
}

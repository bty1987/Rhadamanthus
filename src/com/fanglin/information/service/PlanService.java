package com.fanglin.information.service;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.utils.Paging;

public interface PlanService {

	public void pagePlan(Paging paging, List<Filter> filters, Authentication authentication, int company);

	public PlanVO queryPlan(PlanVO planVO) throws FLException;

	public List<PlanVO> existPlan(PlanVO planVO, int company) throws FLException;

	public int createPlan(PlanVO planVO, String userId, int company) throws FLException, ParseException;

	public int updatePlan(PlanVO PlanVO, String userId) throws FLException, ParseException;

	public int updatePlanForAdvance(PlanVO PlanVO) throws FLException;

	public int cancelPlan(PlanVO planVO, String userId) throws FLException;

}

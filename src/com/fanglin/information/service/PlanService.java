package com.fanglin.information.service;

import java.text.ParseException;
import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.PlanVO;
import com.fanglin.utils.Paging;

public interface PlanService {
	
	public void pagePlan(Paging paging, List<Filter> filters);
	
	public int createPlan(PlanVO planVO,String userId) throws FLException, ParseException;
	
    public int updatePlan(PlanVO PlanVO,String userId) throws FLException ,ParseException;
    
    public int updatePlanSchedule(PlanVO PlanVO) throws FLException;
    
    public int cancelPlan(PlanVO planVO,String userId) throws FLException;


}

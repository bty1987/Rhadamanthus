package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionScheduleService {

	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO);
	
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO);
	
	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;
	
	public int beginConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;
	
	public int finishConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;
	
	public int checkoutConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

}

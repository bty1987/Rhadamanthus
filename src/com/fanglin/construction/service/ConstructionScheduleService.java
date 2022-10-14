package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionScheduleService {

	public void pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company);

	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int beginConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int finishConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int checkoutConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

}

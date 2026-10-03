package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionScheduleService {

	public void pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public ConstructionScheduleVO queryConstructionScheduleByCsid(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void updateConstructionScheduleForNorm(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void updateConstructionScheduleForScal(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void updateConstructionScheduleForPeriod(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void updateConstructionScheduleForSalary(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int beginConstructionSchedule(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;

	public int finishConstructionSchedule(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException;

	public int checkoutConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void enterConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void leaveConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public int resetConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void planConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void addConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

	public void deleteConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException;

}

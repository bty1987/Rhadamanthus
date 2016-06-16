/**
 * @File Name		: BricklayConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.BricklayConstructionScheduleVO;
import com.fanglin.construction.vo.BricklayConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface BricklayConstructionScheduleService {
	
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleById(int bcsId);
	
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleByOrderId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public List<BricklayConstructionScheduleWorkerVO> queryBricklayConstructionScheduleWorkerByBcsId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void saveOrUpdateBricklayConstructionSchedule(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void setBricklayConstructionScheduleForTimeFlag(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void setBricklayConstructionScheduleForInfo(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public int addBricklayConstructionScheduleWorker(BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO) throws FLException;
	
	public int setBricklayConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setBricklayConstructionScheduleWorkerForRaty(List<BricklayConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteBricklayConstructionScheduleWorker(BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO) throws FLException;
	
}

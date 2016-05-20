/**
 * @File Name		: CleaningConstructionScheduleService.java
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

import com.fanglin.construction.vo.CleaningConstructionScheduleVO;
import com.fanglin.construction.vo.CleaningConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface CleaningConstructionScheduleService {
	
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleById(int ccsId);
	
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleByOrderId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);

	public List<CleaningConstructionScheduleWorkerVO> queryCleaningConstructionScheduleWorkerByCcsId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public int saveOrUpdateCleaningConstructionSchedule(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public int addCleaningConstructionScheduleWorker(CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO) throws FLException;
	
	public void setCleaningConstructionScheduleForTimeFlag(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public void setCleaningConstructionScheduleForInfo(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public int setCleaningConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setCleaningConstructionScheduleWorkerForRaty(List<CleaningConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteCleaningConstructionScheduleWorker(CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO) throws FLException;
	
}

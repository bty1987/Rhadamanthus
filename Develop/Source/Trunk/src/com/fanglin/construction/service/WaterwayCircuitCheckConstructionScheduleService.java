/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleService.java
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

import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface WaterwayCircuitCheckConstructionScheduleService {
	
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleById(int wcccsId);
	
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleByOrderId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule);

	public List<WaterwayCircuitCheckConstructionScheduleWorkerVO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public void saveOrUpdateWaterwayCircuitCheckConstructionSchedule(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public int addWaterwayCircuitCheckConstructionScheduleWorker(WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO) throws FLException;
	
	public void setWaterwayCircuitCheckConstructionScheduleForTimeFlag(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public void setWaterwayCircuitCheckConstructionScheduleForInfo(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public int setWaterwayCircuitCheckConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setWaterwayCircuitCheckConstructionScheduleWorkerForRaty(List<WaterwayCircuitCheckConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteWaterwayCircuitCheckConstructionScheduleWorker(WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO) throws FLException;
	
}

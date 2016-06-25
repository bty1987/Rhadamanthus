/**
 * @File Name		: CarpentConstructionScheduleService.java
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

import com.fanglin.construction.vo.CarpentConstructionScheduleVO;
import com.fanglin.construction.vo.CarpentConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface CarpentConstructionScheduleService {
	
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleById(int ccsId);
	
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleByOrderId(CarpentConstructionScheduleVO carpentConstructionScheduleVO);

	public List<CarpentConstructionScheduleWorkerVO> queryCarpentConstructionScheduleWorkerByCcsId(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public int saveOrUpdateCarpentConstructionSchedule(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public void setCarpentConstructionScheduleForTimeFlag(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public void setCarpentConstructionScheduleForInfo(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public int addCarpentConstructionScheduleWorker(CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO) throws FLException;
	
	public int setCarpentConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setCarpentConstructionScheduleWorkerForRaty(List<CarpentConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteCarpentConstructionScheduleWorker(CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO) throws FLException;
	
}

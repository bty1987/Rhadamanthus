/**
 * @File Name		: PutlineConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.PutlineConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;

public interface PutlineConstructionScheduleService {
	
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleById(int plcsId);
	
	public PutlineConstructionScheduleVO queryPutlineConstructionScheduleByOrderId(PutlineConstructionScheduleVO putlineConstructionScheduleVO);
	
	public int saveOrUpdatePutlineConstructionSchedule(PutlineConstructionScheduleVO putlineConstructionScheduleVO);
	
	public void setPutlineConstructionScheduleForStatus(PutlineConstructionScheduleVO putlineConstructionScheduleVO, String userId);
	
	public void setPutlineConstructionScheduleForInfo(PutlineConstructionScheduleVO putlineConstructionScheduleVO);
	
	public void setPutlineConstructionScheduleWorker(PutlineConstructionScheduleVO putlineConstructionScheduleVO) throws FLException;
	
	public void setPutlineConstructionScheduleForService(PutlineConstructionScheduleVO putlineConstructionScheduleVO);
	
	public int setPutlineConstructionScheduleForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
}

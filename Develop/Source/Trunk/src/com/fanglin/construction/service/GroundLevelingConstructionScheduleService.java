/**
 * @File Name		: OilConstructionScheduleService.java
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
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleVO;
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface GroundLevelingConstructionScheduleService {
	
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleById(int glcsId);
	
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleByOrderId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);

	public List<GroundLevelingConstructionScheduleWorkerVO> queryGroundLevelingConstructionScheduleWorkerByOcsId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public int saveOrUpdateGroundLevelingConstructionSchedule(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public int addGroundLevelingConstructionScheduleWorker(GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO) throws FLException;
	
	public void setGroundLevelingConstructionScheduleForTimeFlag(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public void setGroundLevelingConstructionScheduleForInfo(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public int setGroundLevelingConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setGroundLevelingConstructionScheduleWorkerForRaty(List<GroundLevelingConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteGroundLevelingConstructionScheduleWorker(GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO) throws FLException;
	
}

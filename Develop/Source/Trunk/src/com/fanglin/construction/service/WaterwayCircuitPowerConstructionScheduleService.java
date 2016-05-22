/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleService.java
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
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface WaterwayCircuitPowerConstructionScheduleService {
	
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleById(int wcpcsId);
	
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleByOrderId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule);

	public List<WaterwayCircuitPowerConstructionScheduleWorkerVO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public void saveOrUpdateWaterwayCircuitPowerConstructionSchedule(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public int addWaterwayCircuitPowerConstructionScheduleWorker(WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO) throws FLException;
	
	public void setWaterwayCircuitPowerConstructionScheduleForTimeFlag(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public void setWaterwayCircuitPowerConstructionScheduleForInfo(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public int setWaterwayCircuitPowerConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setWaterwayCircuitPowerConstructionScheduleWorkerForRaty(List<WaterwayCircuitPowerConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteWaterwayCircuitPowerConstructionScheduleWorker(WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO) throws FLException;
	
}

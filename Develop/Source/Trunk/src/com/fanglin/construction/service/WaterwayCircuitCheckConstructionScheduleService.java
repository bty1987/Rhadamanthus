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

import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleVO;

public interface WaterwayCircuitCheckConstructionScheduleService {
	
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleById(int wcccsId);
	
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleByOrderId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule);

	public void saveOrUpdateWaterwayCircuitCheckConstructionSchedule(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public void setWaterwayCircuitCheckConstructionScheduleForTimeFlag(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
	public void setWaterwayCircuitCheckConstructionScheduleForInfo(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO);
	
}

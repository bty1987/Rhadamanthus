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

import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleVO;

public interface WaterwayCircuitPowerConstructionScheduleService {
	
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleById(int wcpcsId);
	
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleByOrderId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule);

	public void saveOrUpdateWaterwayCircuitPowerConstructionSchedule(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public void setWaterwayCircuitPowerConstructionScheduleForTimeFlag(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
	
	public void setWaterwayCircuitPowerConstructionScheduleForInfo(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO);
}

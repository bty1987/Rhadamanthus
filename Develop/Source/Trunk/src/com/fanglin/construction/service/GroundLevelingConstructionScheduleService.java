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

import com.fanglin.construction.vo.GroundLevelingConstructionScheduleVO;

public interface GroundLevelingConstructionScheduleService {
	
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleById(int glcsId);
	
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleByOrderId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public void setGroundLevelingConstructionScheduleForTimeFlag(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
	public void setGroundLevelingConstructionScheduleForInfo(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO);
	
}

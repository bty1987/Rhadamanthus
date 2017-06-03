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

import com.fanglin.construction.vo.CarpentConstructionScheduleVO;

public interface CarpentConstructionScheduleService {
	
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleById(int ccsId);
	
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleByOrderId(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public void setCarpentConstructionScheduleForTimeFlag(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
	public void setCarpentConstructionScheduleForInfo(CarpentConstructionScheduleVO carpentConstructionScheduleVO);
	
}

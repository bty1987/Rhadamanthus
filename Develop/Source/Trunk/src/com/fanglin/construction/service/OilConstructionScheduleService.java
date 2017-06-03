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

import com.fanglin.construction.vo.OilConstructionScheduleVO;

public interface OilConstructionScheduleService {
	
	public OilConstructionScheduleVO queryOilConstructionScheduleById(int ocsId);
	
	public OilConstructionScheduleVO queryOilConstructionScheduleByOrderId(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public void setOilConstructionScheduleForTimeFlag(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public void setOilConstructionScheduleForInfo(OilConstructionScheduleVO oilConstructionScheduleVO);
	
}

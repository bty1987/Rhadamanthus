/**
 * @File Name		: CleaningConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import com.fanglin.construction.vo.CleaningConstructionScheduleVO;

public interface CleaningConstructionScheduleService {
	
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleById(int ccsId);
	
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleByOrderId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public int saveOrUpdateCleaningConstructionSchedule(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public void setCleaningConstructionScheduleForTimeFlag(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
	public void setCleaningConstructionScheduleForInfo(CleaningConstructionScheduleVO cleaningConstructionScheduleVO);
	
}

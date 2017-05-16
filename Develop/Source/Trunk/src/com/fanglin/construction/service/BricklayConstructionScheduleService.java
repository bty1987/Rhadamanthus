/**
 * @File Name		: BricklayConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import com.fanglin.construction.vo.BricklayConstructionScheduleVO;

public interface BricklayConstructionScheduleService {
	
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleById(int bcsId);
	
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleByOrderId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void saveOrUpdateBricklayConstructionSchedule(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void setBricklayConstructionScheduleForTimeFlag(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
	
	public void setBricklayConstructionScheduleForInfo(BricklayConstructionScheduleVO bricklayConstructionScheduleVO);
}

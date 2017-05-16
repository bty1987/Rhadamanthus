/**
 * @File Name		: ChanConstructionScheduleService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import com.fanglin.construction.vo.ChanConstructionScheduleVO;

public interface ChanConstructionScheduleService {
	
	public ChanConstructionScheduleVO queryChanConstructionScheduleById(int ccsId);
	
	public ChanConstructionScheduleVO queryChanConstructionScheduleByOrderId(ChanConstructionScheduleVO chanConstructionScheduleVO);
	
	public int saveOrUpdateChanConstructionSchedule(ChanConstructionScheduleVO chanConstructionScheduleVO);
	
	public void setChanConstructionScheduleForTimeFlag(ChanConstructionScheduleVO chanConstructionScheduleVO);
	
	public void setChanConstructionScheduleForStatus(ChanConstructionScheduleVO chanConstructionScheduleVO);
	
	public void setChanConstructionScheduleForInfo(ChanConstructionScheduleVO chanConstructionScheduleVO);
}

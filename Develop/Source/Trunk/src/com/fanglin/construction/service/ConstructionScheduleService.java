package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionScheduleVO;

public interface ConstructionScheduleService {

	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO);
	
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO);

	public void setConstructionScheduleForStatus(ConstructionScheduleVO constructionScheduleVO);

	public void setConstructionScheduleForInfo(ConstructionScheduleVO constructionScheduleVO);

}

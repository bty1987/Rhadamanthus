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

import java.util.List;

import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.OilConstructionScheduleVO;
import com.fanglin.construction.vo.OilConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;

public interface OilConstructionScheduleService {
	
	public OilConstructionScheduleVO queryOilConstructionScheduleById(int ocsId);
	
	public OilConstructionScheduleVO queryOilConstructionScheduleByOrderId(OilConstructionScheduleVO oilConstructionScheduleVO);

	public List<OilConstructionScheduleWorkerVO> queryOilConstructionScheduleWorkerByOcsId(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public int saveOrUpdateOilConstructionSchedule(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public int addOilConstructionScheduleWorker(OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO) throws FLException;
	
	public void setOilConstructionScheduleForTimeFlag(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public void setOilConstructionScheduleForInfo(OilConstructionScheduleVO oilConstructionScheduleVO);
	
	public int setOilConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException;
	
	public void setOilConstructionScheduleWorkerForRaty(List<OilConstructionScheduleWorkerVO> constructionScheduleWorkers);
	
	public int deleteOilConstructionScheduleWorker(OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO) throws FLException;
	
}

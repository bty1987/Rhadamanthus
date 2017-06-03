/**
 * @File Name		: OilConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.service.OilConstructionScheduleService;
import com.fanglin.construction.vo.OilConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;

@Service("oilConstructionScheduleService")
@Transactional(readOnly=true)
public class OilConstructionScheduleServiceImpl implements OilConstructionScheduleService {
	
	@Autowired
	private OilConstructionScheduleDao oilConstructionScheduleDao;
	
	@Override
	public OilConstructionScheduleVO queryOilConstructionScheduleById(int ocsId){
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(ocsId);
		OilConstructionScheduleVO oilConstructionScheduleVO = new OilConstructionScheduleVO();
		
		BeanUtil.copyProperties(oilConstructionSchedulePO, oilConstructionScheduleVO);
		
		return oilConstructionScheduleVO;
	}

	@Override
	public OilConstructionScheduleVO queryOilConstructionScheduleByOrderId(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		if(oilConstructionScheduleVO == null){
			return null;
		}
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByOrderId(oilConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(oilConstructionSchedulePO, oilConstructionScheduleVO);
		
		return oilConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setOilConstructionScheduleForTimeFlag(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleVO.getOcsId());
		
		oilConstructionSchedulePO.setEndTimeFlag(oilConstructionScheduleVO.getEndTimeFlag());
		oilConstructionSchedulePO.setStartTimeFlag(oilConstructionScheduleVO.getStartTimeFlag());
		
		oilConstructionScheduleDao.update(oilConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setOilConstructionScheduleForInfo(OilConstructionScheduleVO oilConstructionScheduleVO){

		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleVO.getOcsId());
		
		oilConstructionSchedulePO.setWorkerId(oilConstructionScheduleVO.getWorkerId());
		oilConstructionSchedulePO.setEndTime(oilConstructionScheduleVO.getEndTime());
		oilConstructionSchedulePO.setStartTime(oilConstructionScheduleVO.getStartTime());
		
		oilConstructionScheduleDao.update(oilConstructionSchedulePO);
	}
	
}

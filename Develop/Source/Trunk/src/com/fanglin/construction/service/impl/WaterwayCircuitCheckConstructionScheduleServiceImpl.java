/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleDao;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.construction.service.WaterwayCircuitCheckConstructionScheduleService;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("waterwayCircuitCheckConstructionScheduleService")
@Transactional(readOnly=true)
public class WaterwayCircuitCheckConstructionScheduleServiceImpl implements WaterwayCircuitCheckConstructionScheduleService {
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleDao waterwayCircuitCheckConstructionScheduleDao;
	
	@Override
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleById(int wcccsId){
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(wcccsId);
		WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO = new WaterwayCircuitCheckConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionSchedulePO, waterwayCircuitCheckConstructionScheduleVO);
		
		return waterwayCircuitCheckConstructionScheduleVO;
	}

	@Override
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleByOrderId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule){
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(waterwayCircuitCheckConstructionSchedule.getOrderId());
		WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO = new WaterwayCircuitCheckConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionSchedulePO, waterwayCircuitCheckConstructionScheduleVO);
		
		return waterwayCircuitCheckConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateWaterwayCircuitCheckConstructionSchedule(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(waterwayCircuitCheckConstructionScheduleVO.getOrderId());
		
		if(waterwayCircuitCheckConstructionScheduleVO.getWcccsId() == null){
			waterwayCircuitCheckConstructionSchedulePO = new WaterwayCircuitCheckConstructionSchedulePO();
			waterwayCircuitCheckConstructionSchedulePO.setEndTime(DateUtil.current(WaterwayCircuitCheckConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			waterwayCircuitCheckConstructionSchedulePO.setStartTime(DateUtil.current(WaterwayCircuitCheckConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleVO, waterwayCircuitCheckConstructionSchedulePO);
		waterwayCircuitCheckConstructionScheduleDao.saveOrUpdate(waterwayCircuitCheckConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitCheckConstructionScheduleForTimeFlag(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(waterwayCircuitCheckConstructionScheduleVO.getWcccsId());
		
		waterwayCircuitCheckConstructionSchedulePO.setStartTimeFlag(waterwayCircuitCheckConstructionScheduleVO.getStartTimeFlag());
		waterwayCircuitCheckConstructionSchedulePO.setEndTimeFlag(waterwayCircuitCheckConstructionScheduleVO.getEndTimeFlag());
		
		waterwayCircuitCheckConstructionScheduleDao.update(waterwayCircuitCheckConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitCheckConstructionScheduleForInfo(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(waterwayCircuitCheckConstructionScheduleVO.getWcccsId());
		
		if(waterwayCircuitCheckConstructionSchedulePO != null){
			waterwayCircuitCheckConstructionSchedulePO.setEndTime(waterwayCircuitCheckConstructionScheduleVO.getEndTime());
			waterwayCircuitCheckConstructionSchedulePO.setStartTime(waterwayCircuitCheckConstructionScheduleVO.getStartTime());
			
			waterwayCircuitCheckConstructionScheduleDao.update(waterwayCircuitCheckConstructionSchedulePO);
		}
	}

}

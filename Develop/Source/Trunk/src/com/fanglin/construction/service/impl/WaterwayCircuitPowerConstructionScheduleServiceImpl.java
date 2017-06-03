/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.construction.service.WaterwayCircuitPowerConstructionScheduleService;
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;

@Service("waterwayCircuitPowerConstructionScheduleService")
@Transactional(readOnly=true)
public class WaterwayCircuitPowerConstructionScheduleServiceImpl implements WaterwayCircuitPowerConstructionScheduleService {
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleDao waterwayCircuitPowerConstructionScheduleDao;
	
	@Override
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleById(int wcpcsId){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(wcpcsId);
		WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO = new WaterwayCircuitPowerConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionSchedulePO, waterwayCircuitPowerConstructionScheduleVO);
		
		return waterwayCircuitPowerConstructionScheduleVO;
	}

	@Override
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleByOrderId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(waterwayCircuitPowerConstructionSchedule.getOrderId());
		WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO = new WaterwayCircuitPowerConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionSchedulePO, waterwayCircuitPowerConstructionScheduleVO);
		
		return waterwayCircuitPowerConstructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitPowerConstructionScheduleForTimeFlag(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId());
		
		waterwayCircuitPowerConstructionSchedulePO.setStartTimeFlag(waterwayCircuitPowerConstructionScheduleVO.getStartTimeFlag());
		waterwayCircuitPowerConstructionSchedulePO.setEndTimeFlag(waterwayCircuitPowerConstructionScheduleVO.getEndTimeFlag());
		
		waterwayCircuitPowerConstructionScheduleDao.update(waterwayCircuitPowerConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitPowerConstructionScheduleForInfo(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId());
		
		if(waterwayCircuitPowerConstructionSchedulePO != null){
			waterwayCircuitPowerConstructionSchedulePO.setEndTime(waterwayCircuitPowerConstructionScheduleVO.getEndTime());
			waterwayCircuitPowerConstructionSchedulePO.setStartTime(waterwayCircuitPowerConstructionScheduleVO.getStartTime());
			
			waterwayCircuitPowerConstructionScheduleDao.update(waterwayCircuitPowerConstructionSchedulePO);
		}
	}
}

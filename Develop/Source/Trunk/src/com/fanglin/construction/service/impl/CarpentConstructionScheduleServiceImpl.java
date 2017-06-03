/**
 * @File Name		: CarpentConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.service.CarpentConstructionScheduleService;
import com.fanglin.construction.vo.CarpentConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;

@Service("carpentConstructionScheduleService")
@Transactional(readOnly=true)
public class CarpentConstructionScheduleServiceImpl implements CarpentConstructionScheduleService {
	
	@Autowired
	private CarpentConstructionScheduleDao carpentConstructionScheduleDao;
	
	@Override
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleById(int ccsId){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(ccsId);
		CarpentConstructionScheduleVO carpentConstructionScheduleVO = new CarpentConstructionScheduleVO();
		BeanUtil.copyProperties(carpentConstructionSchedulePO, carpentConstructionScheduleVO);
		
		return carpentConstructionScheduleVO;
	}

	@Override
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleByOrderId(CarpentConstructionScheduleVO carpentConstructionScheduleVO){

		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByOrderId(carpentConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(carpentConstructionSchedulePO, carpentConstructionScheduleVO);
		
		return carpentConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCarpentConstructionScheduleForTimeFlag(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(carpentConstructionScheduleVO.getCcsId());
		
		carpentConstructionSchedulePO.setStartTimeFlag(carpentConstructionScheduleVO.getStartTimeFlag());
		carpentConstructionSchedulePO.setEndTimeFlag(carpentConstructionScheduleVO.getStartTimeFlag());
		
		carpentConstructionScheduleDao.update(carpentConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCarpentConstructionScheduleForInfo(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(carpentConstructionScheduleVO.getCcsId());
		
		carpentConstructionSchedulePO.setWorkerId(carpentConstructionScheduleVO.getWorkerId());
		carpentConstructionSchedulePO.setStartTime(carpentConstructionScheduleVO.getStartTime());
		carpentConstructionSchedulePO.setEndTime(carpentConstructionScheduleVO.getEndTime());
		
		carpentConstructionScheduleDao.update(carpentConstructionSchedulePO);
	}
	
}

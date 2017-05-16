/**
 * @File Name		: GroundLevelingConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.GroundLevelingConstructionScheduleDao;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.service.GroundLevelingConstructionScheduleService; 
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("groundLevelingConstructionScheduleService")
@Transactional(readOnly=true)
public class GroundLevelingConstructionScheduleServiceImpl implements GroundLevelingConstructionScheduleService {
	
	@Autowired
	private GroundLevelingConstructionScheduleDao groundLevelingConstructionScheduleDao;

	@Override
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleById(int glcsId){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(glcsId);
		GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO = new GroundLevelingConstructionScheduleVO();
		
		BeanUtil.copyProperties(groundLevelingConstructionSchedulePO, groundLevelingConstructionScheduleVO);
		
		return groundLevelingConstructionScheduleVO;
	}

	@Override
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleByOrderId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.queryGroundLevelingConstructionScheduleByOrderId(groundLevelingConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(groundLevelingConstructionSchedulePO, groundLevelingConstructionScheduleVO);
		
		return groundLevelingConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateGroundLevelingConstructionSchedule(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){

		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = null;
		
		if(groundLevelingConstructionScheduleVO.getGlcsId() == 0){
			groundLevelingConstructionSchedulePO = new GroundLevelingConstructionSchedulePO();
			groundLevelingConstructionSchedulePO.setEndTime(DateUtil.current(GroundLevelingConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			groundLevelingConstructionSchedulePO.setStartTime(DateUtil.current(GroundLevelingConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		}
		
		BeanUtil.copyProperties(groundLevelingConstructionScheduleVO, groundLevelingConstructionSchedulePO);
		groundLevelingConstructionScheduleDao.saveOrUpdate(groundLevelingConstructionSchedulePO);

		return groundLevelingConstructionSchedulePO.getGlcsId();
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setGroundLevelingConstructionScheduleForTimeFlag(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		
		groundLevelingConstructionSchedulePO.setEndTimeFlag(groundLevelingConstructionScheduleVO.getEndTimeFlag());
		groundLevelingConstructionSchedulePO.setStartTimeFlag(groundLevelingConstructionScheduleVO.getStartTimeFlag());
		
		groundLevelingConstructionScheduleDao.update(groundLevelingConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setGroundLevelingConstructionScheduleForInfo(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		
		groundLevelingConstructionSchedulePO.setWorkerId(groundLevelingConstructionScheduleVO.getWorkerId());
		groundLevelingConstructionSchedulePO.setEndTime(groundLevelingConstructionScheduleVO.getEndTime());
		groundLevelingConstructionSchedulePO.setStartTime(groundLevelingConstructionScheduleVO.getStartTime());
		
		groundLevelingConstructionScheduleDao.update(groundLevelingConstructionSchedulePO);
	}

}

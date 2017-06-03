/**
 * @File Name		: BricklayConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.service.BricklayConstructionScheduleService;
import com.fanglin.construction.vo.BricklayConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;

@Service("bricklayConstructionScheduleService")
@Transactional(readOnly=true)
public class BricklayConstructionScheduleServiceImpl implements BricklayConstructionScheduleService {
	
	@Autowired
	private BricklayConstructionScheduleDao bricklayConstructionScheduleDao;
	
	@Override
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleById(int bcsId){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(Integer.valueOf(bcsId));
		BricklayConstructionScheduleVO bricklayConstructionScheduleVO = new BricklayConstructionScheduleVO();
		
		BeanUtil.copyProperties(bricklayConstructionSchedulePO, bricklayConstructionScheduleVO);
		
		return bricklayConstructionScheduleVO;
	}

	@Override
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleByOrderId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByOrderId(bricklayConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(bricklayConstructionSchedulePO, bricklayConstructionScheduleVO);
		
		return bricklayConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setBricklayConstructionScheduleForTimeFlag(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		Integer bcsId = bricklayConstructionScheduleVO.getBcsId();
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(bcsId);
		
		bricklayConstructionSchedulePO.setEndTimeFlag(bricklayConstructionScheduleVO.getEndTimeFlag());
		bricklayConstructionSchedulePO.setStartTimeFlag(bricklayConstructionScheduleVO.getStartTimeFlag());
		
		bricklayConstructionScheduleDao.update(bricklayConstructionSchedulePO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setBricklayConstructionScheduleForInfo(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		Integer bcsId = bricklayConstructionScheduleVO.getBcsId();
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(bcsId);
		
		bricklayConstructionSchedulePO.setStartTime(bricklayConstructionScheduleVO.getStartTime());
		bricklayConstructionSchedulePO.setEndTime(bricklayConstructionScheduleVO.getEndTime());
		
		bricklayConstructionScheduleDao.update(bricklayConstructionSchedulePO);
		
	}
	
}
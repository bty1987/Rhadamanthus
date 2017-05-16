/**
 * @File Name		: CleaningConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.CleaningConstructionScheduleDao;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.service.CleaningConstructionScheduleService;
import com.fanglin.construction.vo.CleaningConstructionScheduleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("cleaningConstructionScheduleService")
@Transactional(readOnly=true)
public class CleaningConstructionScheduleServiceImpl implements CleaningConstructionScheduleService {
	
	@Autowired
	private CleaningConstructionScheduleDao cleaningConstructionScheduleDao;
	
	@Override
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleById(int ccsId){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(ccsId);
		CleaningConstructionScheduleVO cleaningConstructionScheduleVO = new CleaningConstructionScheduleVO();
		
		BeanUtil.copyProperties(cleaningConstructionSchedulePO, cleaningConstructionScheduleVO);
		
		return cleaningConstructionScheduleVO;
	}

	@Override
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleByOrderId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.queryCleaningConstructionScheduleByOrderId(cleaningConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(cleaningConstructionSchedulePO, cleaningConstructionScheduleVO);
		
		return cleaningConstructionScheduleVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateCleaningConstructionSchedule(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = null;
		
		if(cleaningConstructionScheduleVO.getCcsId() == 0){
			cleaningConstructionSchedulePO = new CleaningConstructionSchedulePO();
			cleaningConstructionSchedulePO.setEndTime(DateUtil.current(CleaningConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			cleaningConstructionSchedulePO.setStartTime(DateUtil.current(CleaningConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		}
		
		BeanUtil.copyProperties(cleaningConstructionScheduleVO, cleaningConstructionSchedulePO);
		cleaningConstructionScheduleDao.saveOrUpdate(cleaningConstructionSchedulePO);
		
		return cleaningConstructionSchedulePO.getCcsId();
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCleaningConstructionScheduleForTimeFlag(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		
		cleaningConstructionSchedulePO.setStartTimeFlag(cleaningConstructionScheduleVO.getStartTimeFlag());
		cleaningConstructionSchedulePO.setEndTimeFlag(cleaningConstructionScheduleVO.getEndTimeFlag());
		
		cleaningConstructionScheduleDao.update(cleaningConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCleaningConstructionScheduleForInfo(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		
		cleaningConstructionSchedulePO.setWorkerId(cleaningConstructionScheduleVO.getWorkerId());
		cleaningConstructionSchedulePO.setStartTime(cleaningConstructionScheduleVO.getStartTime());
		cleaningConstructionSchedulePO.setEndTime(cleaningConstructionScheduleVO.getEndTime());
		
		cleaningConstructionScheduleDao.update(cleaningConstructionSchedulePO);
	}
	
}

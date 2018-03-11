/**
 * @File Name		: ActivityItemServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.ActivityItemDao;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.service.ActivityItemService;
import com.fanglin.information.vo.ActivityItemVO;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.utils.BeanUtil;

@Service("activityItemService")
@Transactional(readOnly=true)
public class ActivityItemServiceImpl implements ActivityItemService {
	
	@Autowired
	private ActivityItemDao activityItemDao;
	
	@Autowired
	private ActivityDao activityDao;

	@Override
	public List<ActivityItemVO> queryActivityItemByAId(ActivityVO activityVO) {
		
		List<ActivityItemPO> activityItemPOs = activityItemDao.queryActivityItemByAId(activityVO.getAid());
		List<ActivityItemVO> activityItemVOs = new ArrayList<ActivityItemVO>();
		
		for(ActivityItemPO activityItemPO: activityItemPOs){
			ActivityItemVO activityItemVO = new ActivityItemVO();
			BeanUtil.copyProperties(activityItemPO, activityItemVO);
			
			activityItemVOs.add(activityItemVO);
		}
		
		return activityItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO) throws FLException {
		
		ActivityPO activityPO = activityDao.get(activityVO.getAid());
		
		if(activityPO == null){
			throw new FLException(160011, "活动信息不存在");
		}
		
		ActivityItemPO activityItemPO = new ActivityItemPO();
		BeanUtil.copyProperties(activityItemVO, activityItemPO);
		
		activityItemPO.setAid(activityPO.getAid());
		activityItemPO.setActivityName(activityPO.getName());
		
		activityItemDao.save(activityItemPO);
		
		BeanUtil.copyProperties(activityItemPO, activityItemVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO) throws FLException {
		
		ActivityItemPO activityItemPO = activityItemDao.get(activityItemVO.getAiid());
		
		if(activityItemPO == null){
			throw new FLException(160013, "活动物品不存在");
		}
		
		activityItemPO.setName(activityItemVO.getName());
		activityItemPO.setType(activityItemVO.getType());
		activityItemPO.setMoney(activityItemVO.getMoney());
		
		activityItemDao.update(activityItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteActivityItemByAiId(ActivityVO activityVO, ActivityItemVO activityItemVO) {
		
		activityItemDao.deleteById(activityItemVO.getAiid());
		
		return 0;
	}
	
}

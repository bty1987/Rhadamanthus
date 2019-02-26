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
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityItemPO;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.AwardStockPO;
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
	
	@Autowired
	private AwardStockDao awardStockDao;

	@Override
	public List<ActivityItemVO> queryActivityItemByAid(ActivityVO activityVO) {
		
		List<ActivityItemPO> activityItemPOs = activityItemDao.queryActivityItemByAid(activityVO.getAid());
		List<ActivityItemVO> activityItemVOs = new ArrayList<ActivityItemVO>();
		
		for(ActivityItemPO activityItemPO: activityItemPOs){
			
			ActivityItemVO activityItemVO = new ActivityItemVO();
			
			if(activityItemPO.getAsid() == 0) continue;
			
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
		
		AwardStockPO awardStockPO = awardStockDao.get(activityItemVO.getAsid());
		
		ActivityItemPO activityItemPO = new ActivityItemPO();
		
		BeanUtil.copyProperties(activityItemVO, activityItemPO);
		
		activityItemPO.setName(awardStockPO.getName());
		activityItemPO.setAid(activityPO.getAid());
		
		activityItemDao.save(activityItemPO);
		
		BeanUtil.copyProperties(activityItemPO, activityItemVO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteActivityItemByAiid(ActivityVO activityVO, ActivityItemVO activityItemVO) {
		
		activityItemDao.deleteById(activityItemVO.getAiid());
		
		return 0;
	}
}

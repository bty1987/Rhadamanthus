/**
 * @File Name		: ActivityServiceImpl.java
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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.service.ActivityService;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("activityService")
@Transactional(readOnly=true)
public class ActivityServiceImpl implements ActivityService {
	
	@Autowired
	private ActivityDao activityDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void pageActivity(Paging paging, List<FilterVO> filters, String userId) {
		
		filters.add(new FilterVO(ActivityPO.COLUMN_CREATEUSERID_STR, userId, "eq"));
		
		List<ActivityPO> activityPOs = activityDao.pageActivity(paging, filters);
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();
		
		for(ActivityPO activityPO: activityPOs){
			if(activityPO.getStatus() == ActivityPO.STATUS_VALID_INT && activityPO.getEndTime().getTime() < new Date().getTime()){
				activityPO.setStatus(ActivityPO.STATUS_UNVALID_INT);
			}
			
			ActivityVO activityVO = new ActivityVO();
			BeanUtil.copyProperties(activityPO, activityVO);
			
			activityVOs.add(activityVO);
		}
		
		paging.setData(activityVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<ActivityVO> queryActivityForValid() {
		
		List<ActivityPO> activityPOs = activityDao.queryActivityForValid();
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();
		
		for(ActivityPO activityPO: activityPOs){
			if(activityPO.getEndTime().getTime() < new Date().getTime()){
				activityPO.setStatus(ActivityPO.STATUS_UNVALID_INT);
			}else{
				ActivityVO activityVO = new ActivityVO();
				BeanUtil.copyProperties(activityPO, activityVO);
				
				activityVOs.add(activityVO);
			}
		}
		
		return activityVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addActivity(ActivityVO activityVO, String userId, String userName) {
		
		ActivityPO activityPO = new ActivityPO();
		BeanUtil.copyProperties(activityVO, activityPO);
		
		activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		activityPO.setCreateUserId(userId);
		activityPO.setCreateUserName(userName);
		
		activityDao.save(activityPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateActivity(ActivityVO activityVO, String userId) throws FLException {
		
		ActivityPO activityPO = activityDao.get(activityVO.getAid());
		
		if(activityPO == null){
			throw new FLException(160011, "活动信息不存在");
		}
		
		if(activityPO.getStatus() != ActivityPO.STATUS_VALID_INT){
			throw new FLException(160012, "活动当前状态不能修改");
		}
		
		activityPO.setEndTime(activityVO.getEndTime());
		activityPO.setContent(activityVO.getContent());
		
		activityDao.update(activityPO);
	}

}

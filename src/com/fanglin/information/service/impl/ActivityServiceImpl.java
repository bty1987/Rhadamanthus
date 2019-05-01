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
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.service.ActivityService;
import com.fanglin.information.vo.ActivityVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("activityService")
@Transactional(readOnly = true)
public class ActivityServiceImpl implements ActivityService {

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageActivity(Paging paging, List<Filter> filters, String userId, int company) {

		List<ActivityPO> activityPOs = activityDao.pageActivity(paging, filters, company);
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();


		for (ActivityPO activityPO : activityPOs) {
			
			ActivityVO activityVO = new ActivityVO(new UserBaseVO());
			BeanUtil.copyProperties(activityPO, activityVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(activityPO.getCreater(), activityVO.getCreater(), Arrays.asList("dept", "duty"));

			activityVOs.add(activityVO);
		}

		paging.setData(activityVOs);
	}

	@Override
	public List<ActivityVO> queryActivityForValid(ActivityVO activity, int company) {

		List<ActivityPO> activityPOs = activityDao.queryActivityForValid(company, activity.getType());
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();

		for (ActivityPO activityPO : activityPOs) {
			
			ActivityVO activityVO = new ActivityVO(new UserBaseVO());
			
			BeanUtil.copyProperties(activityPO, activityVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(activityPO.getCreater(), activityVO.getCreater(), Arrays.asList("dept", "duty"));

			activityVOs.add(activityVO);
		}

		return activityVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addActivity(ActivityVO activityVO, String userId, String userName, int company) {

		UserPO user = userDao.queryUserByUserId(userId);

		ActivityPO activityPO = new ActivityPO();

		BeanUtil.copyProperties(activityVO, activityPO);

		activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		activityPO.setCreater(user);
		activityPO.setCompany(company);
		activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);// 普通状态

		activityDao.save(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivity(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}
		
		activityPO.setName(activityVO.getName());
		activityPO.setEndTime(activityVO.getEndTime());
		activityPO.setContent(activityVO.getContent());

		activityDao.update(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivityForStatus(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}
		
		if(activityPO.getDefaults() == ActivityPO.DEFAULTS_DEFAULT_INT){
			throw new FLException(160047, "默认活动不可操作");
		}

		activityPO.setStatus(activityVO.getStatus());

		activityDao.update(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivityForDefault(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getStatus() == ActivityPO.STATUS_UNVALID_INT) {// ==无有效的
			throw new FLException(160012, "活动当前状态不能修改");
		}

		activityDao.resetActivityForDefault(activityPO.getType());

		activityPO.setDefaults(ActivityPO.DEFAULTS_DEFAULT_INT); // 更新为0(默认)

		activityDao.update(activityPO);
	}
}

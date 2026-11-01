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

import java.sql.Timestamp;
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
			activityVOs.add(activityPO.ptv(new ActivityVO(new UserBaseVO())));
		}

		paging.setData(activityVOs);
	}

	@Override
	public List<ActivityVO> queryActivityForValid(ActivityVO activityVO, int company) {

		List<ActivityPO> activityPOs = activityDao.queryActivityForValid(company, activityVO.getType());
		List<ActivityVO> activityVOs = new ArrayList<ActivityVO>();

		for (ActivityPO activityPO : activityPOs) {
			activityVOs.add(activityPO.ptv(new ActivityVO(new UserBaseVO())));
		}

		return activityVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addActivity(ActivityVO activityVO, String userId, int company) {

		UserPO creater = userDao.queryUserByUserId(userId);

		ActivityPO activityPO = new ActivityPO();

		BeanUtil.copyProperties(activityVO, activityPO, Arrays.asList("creater"));

		activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		activityPO.setCreater(creater);

		activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);// 普通状态

		activityPO.setCompany(company);

		// 同公司同奖励类型窗口重叠唯一性闸(防两个抽奖活动叠加发双券); 抽奖活动=type 20(初始化SQL预置), 防御性校验
		if (activityPO.getType() == ActivityPO.TYPE_LOTTERY_INT) {
			checkLotteryActivityUnique(activityPO);
		}

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
		activityPO.setValidays(activityVO.getValidays());
		activityPO.setExchange(activityVO.getExchange());
		activityPO.setAtttype(activityVO.getAtttype());

		if (activityVO.getPaytype() != null) activityPO.setPaytype(activityVO.getPaytype());

		activityDao.update(activityPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateActivityForStatus(ActivityVO activityVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
			throw new FLException(160011, "活动信息不存在");
		}

		if (activityPO.getDefaults() == ActivityPO.DEFAULTS_DEFAULT_INT) {
			throw new FLException(160047, "默认活动不可操作");
		}

		// 启用动作: 同公司同奖励类型窗口重叠唯一性闸(防两个抽奖活动叠加发双券)
		if (activityVO.getStatus() != null && activityVO.getStatus() == ActivityPO.STATUS_VALID_INT && activityPO.getType() == ActivityPO.TYPE_LOTTERY_INT) {
			checkLotteryActivityUnique(activityPO);
		}

		activityPO.setStatus(activityVO.getStatus());

		activityDao.update(activityPO);
	}

	/**
	 * 抽奖活动唯一性闸: 同公司 + type=抽奖券(20) + status=有效 + 时间窗重叠 (MySQL 5.6 无部分唯一索引, 应用层管)
	 */
	private void checkLotteryActivityUnique(ActivityPO activityPO) {

		// 自身窗口 null 视为无界, 归一为极值日期
		Timestamp startTime = activityPO.getStartTime() == null ? Timestamp.valueOf("1970-01-01 00:00:00") : activityPO.getStartTime();
		Timestamp endTime = activityPO.getEndTime() == null ? Timestamp.valueOf("2999-12-31 23:59:59") : activityPO.getEndTime();

		if (activityDao.countActivityForLottery(activityPO.getCompany(), startTime, endTime, activityPO.getAid()) > 0) {
			throw new FLException(160063, "该公司已存在窗口重叠的抽奖券活动, 不可同时启用");
		}
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

		activityDao.resetActivityForDefault(activityPO.getType(), activityPO.getCompany());

		activityPO.setDefaults(ActivityPO.DEFAULTS_DEFAULT_INT); // 更新为0(默认)

		activityDao.update(activityPO);
	}
}

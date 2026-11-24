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

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
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
import com.fanglin.utils.DateUtil;

@Service("activityItemService")
@Transactional(readOnly = true)
public class ActivityItemServiceImpl implements ActivityItemService {

	@Autowired
	private ActivityItemDao activityItemDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Override
	public List<ActivityItemVO> queryActivityItemByAid(ActivityVO activityVO) {

		List<ActivityItemPO> activityItemPOs = activityItemDao.queryActivityItemByAid(activityVO.getAid(), activityVO.getLevel());
		List<ActivityItemVO> activityItemVOs = new ArrayList<ActivityItemVO>();

		// 阶梯奖品(type=30)物品级有效期过滤: 业务侧选品传 filterWindow=1 启用, 维护页不传全量可见(引擎守卫140116/140117 fail-closed兜底);
		// 逐边界兜底活动窗(item.startTime ?? activity.startTime / item.endTime ?? activity.endTime, 物品优先, null=不设限)
		ActivityPO activityPO = activityVO.getFilterWindow() != null && activityVO.getFilterWindow() == 1 ? activityDao.get(activityVO.getAid()) : null;

		Timestamp now = activityPO == null ? null : DateUtil.getDateToTimestamp(new Date());

		for (ActivityItemPO activityItemPO : activityItemPOs) {

			ActivityItemVO activityItemVO = new ActivityItemVO();

			if (activityItemPO.getAsid() == 0) continue;

			if (now != null && activityItemPO.getType() == ActivityItemPO.TYPE_LADDER_LOTTERY_INT) {

				Timestamp start = activityItemPO.getStartTime() != null ? activityItemPO.getStartTime() : activityPO.getStartTime();
				Timestamp end = activityItemPO.getEndTime() != null ? activityItemPO.getEndTime() : activityPO.getEndTime();

				if ((start != null && now.before(start)) || (end != null && now.after(end))) continue;
			}

			BeanUtil.copyProperties(activityItemPO, activityItemVO);

			// 奖品剩余库存(毫, tranargs÷1000转张): 阶梯奖品面板展示剩余数量用
			AwardStockPO awardStockPO = activityItemPO.getAwardStock();

			if (awardStockPO != null) {
				activityItemVO.setStockNum((int) awardStockPO.getNum());
			}

			activityItemVOs.add(activityItemVO);
		}

		return activityItemVOs;
	}

	@Override
	public ActivityItemVO queryActivityItemByAiid(ActivityItemVO activityItemVO) {

		ActivityItemPO activityItemPO = activityItemDao.get(activityItemVO.getAiid());

		BeanUtil.copyProperties(activityItemPO, activityItemVO);

		return activityItemVO;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO) throws FLException {

		ActivityPO activityPO = activityDao.get(activityVO.getAid());

		if (activityPO == null) {
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
	@Transactional(rollbackFor = Exception.class)
	public int deleteActivityItem(ActivityVO activityVO, ActivityItemVO activityItemVO) {

		activityItemDao.deleteById(activityItemVO.getAiid());

		return 0;
	}

}

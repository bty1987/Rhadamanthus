/**
 * @File Name		: ActivityItemDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.ActivityItemDao;
import com.fanglin.information.po.ActivityItemPO;

@Repository("activityItemDao")
public class ActivityItemDaoImpl extends DaoImpl<ActivityItemPO> implements ActivityItemDao {
	
	public ActivityItemDaoImpl(){
		super(ActivityItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityItemPO> queryActivityItemByAid(long aId, Short level) {
		// JOIN fetch带出奖品库关联, 避免循环逐行get的N+1
		Criteria criteria = session().createCriteria(ActivityItemPO.class).add(Restrictions.eq(ActivityItemPO.COLUMN_AID_STR, aId)).setFetchMode("awardStock", FetchMode.JOIN);

		// level=1(添加活动物品/配置维护)全量; 其余(申领等普通功能, 不传/0)仅普通层级——管理专用项对普通功能不可见
		if (level == null || level.intValue() != ActivityItemPO.LEVEL_MANAGE_INT) {
			criteria.add(Restrictions.eq(ActivityItemPO.COLUMN_LEVEL_STR, ActivityItemPO.LEVEL_COMMON_INT));
		}

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityItemPO> queryActivityItemByAsid(long asid) {
		return session().createCriteria(ActivityItemPO.class).add(Restrictions.eq("asid", asid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityItemPO> queryActivityItemForLadder(long aId) {
		return session().createCriteria(ActivityItemPO.class).add(Restrictions.eq(ActivityItemPO.COLUMN_AID_STR, aId)).add(Restrictions.eq("type", ActivityItemPO.TYPE_LADDER_LOTTERY_INT)).list();
	}

}

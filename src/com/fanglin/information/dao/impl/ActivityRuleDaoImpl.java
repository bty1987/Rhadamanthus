/**
 * @File Name	: ActivityRuleDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.ActivityRuleDao;
import com.fanglin.information.po.ActivityRulePO;

@Repository("activityRuleDao")
public class ActivityRuleDaoImpl extends DaoImpl<ActivityRulePO> implements ActivityRuleDao {

	public ActivityRuleDaoImpl() {
		super(ActivityRulePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityRulePO> queryActivityRuleForEnabled(long aid) {
		return session().createCriteria(ActivityRulePO.class).add(Restrictions.eq("aid", aid)).add(Restrictions.eq("status", ActivityRulePO.STATUS_ENABLED_INT)).addOrder(Order.asc("sort")).addOrder(Order.asc("arId")).list();
	}
}

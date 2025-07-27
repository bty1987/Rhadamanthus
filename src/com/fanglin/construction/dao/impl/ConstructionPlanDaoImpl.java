/**
 * @File Name	: AcceptanceDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionPlanDao;
import com.fanglin.construction.po.ConstructionPlanPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionPlanDao")
public class ConstructionPlanDaoImpl extends DaoImpl<ConstructionPlanPO> implements ConstructionPlanDao {

	public ConstructionPlanDaoImpl() {
		super(ConstructionPlanPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionPlanPO> queryConstructionPlanByOrderId(String orderId) {
		return session().createCriteria(ConstructionPlanPO.class).add(Restrictions.eq(ConstructionPlanPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.asc("sort")).list();
	}

	@Override
	public ConstructionPlanPO queryConstructionPlan(String orderId, int sort) {
		return (ConstructionPlanPO) session().createCriteria(ConstructionPlanPO.class).add(Restrictions.eq(ConstructionPlanPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq("sort", sort)).addOrder(Order.asc("sort")).uniqueResult();
	}

	@Override
	public int countConstructionPlan(String orderId) {

		String sql = "select count(*) from construction.constructionplan where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}
}

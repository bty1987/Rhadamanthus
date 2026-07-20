/**
 * @File Name		: PeriodDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.dao.PeriodDao;
import com.fanglin.finance.po.PeriodPO;

@Repository("periodDao")
public class PeriodDaoImpl extends DaoImpl<PeriodPO> implements PeriodDao {

	public PeriodDaoImpl(){
		super(PeriodPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PeriodPO> queryPeriod() {
		return session().createCriteria(PeriodPO.class).addOrder(Order.asc(PeriodPO.COLUMN_PERIOD_STR)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PeriodPO> queryPeriodForOpen() {
		return session().createCriteria(PeriodPO.class).add(Restrictions.eq(PeriodPO.COLUMN_STATUS_STR, PeriodPO.STATUS_INIT_INT)).list();
	}

	@Override
	public PeriodPO queryPeriodForCurrent() {
		return (PeriodPO) session().createCriteria(PeriodPO.class).addOrder(Order.desc(PeriodPO.COLUMN_PERIOD_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	public PeriodPO queryPeriodByPeriod(String period) throws FLException {
		return (PeriodPO) session().createCriteria(PeriodPO.class).add(Restrictions.eq(PeriodPO.COLUMN_PERIOD_STR, period)).setMaxResults(1).uniqueResult();
	}
	
}

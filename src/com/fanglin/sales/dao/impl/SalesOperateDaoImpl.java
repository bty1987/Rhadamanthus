package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesOperateDao;
import com.fanglin.sales.po.SalesOperatePO;

@Repository("salesOperateDao")
public class SalesOperateDaoImpl extends DaoImpl<SalesOperatePO> implements SalesOperateDao {

	public SalesOperateDaoImpl() {
		super(SalesOperatePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesOperatePO> querySalesOperateBySid(long sid) {
		return session().createCriteria(SalesOperatePO.class).add(Restrictions.eq(SalesOperatePO.COLUMN_SID_STR, sid)).addOrder(Order.desc("soid")).list();
	}

}

package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.SalesDeliveryStatusRightDao;
import com.fanglin.right.po.SalesDeliveryStatusRightPO;

@Repository("salesDeliveryStatusRightDao")
public class SalesDeliveryStatusRightDaoImpl extends DaoImpl<SalesDeliveryStatusRightPO> implements SalesDeliveryStatusRightDao {
	public SalesDeliveryStatusRightDaoImpl() {
		super(SalesDeliveryStatusRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesDeliveryStatusRightPO> querySalesDeliveryStatusRight(long bid) {
		return session().createCriteria(SalesDeliveryStatusRightPO.class).add(Restrictions.eq(SalesDeliveryStatusRightPO.COLUMN_BID_STR, bid)).list();
	}

	@Override
	public void deleteSalesDeliveryStatus(Long bid) {

		String sql = "delete from platform.salesdeliverystatusright where bid = :bid";

		session().createSQLQuery(sql).setLong("bid", bid).executeUpdate();

	}

}

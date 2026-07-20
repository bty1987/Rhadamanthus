package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.AdvanceDao;
import com.fanglin.payment.po.AdvancePaymentPO;

@Repository("advanceOrderDao")
public class AdvanceDaoImpl extends DaoImpl<AdvancePaymentPO> implements AdvanceDao {

	public AdvanceDaoImpl() {
		super(AdvancePaymentPO.class);
	}

	@Override
	public AdvancePaymentPO queryCusAdvance(String orderId) {
		return (AdvancePaymentPO) session().createCriteria(AdvancePaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).setMaxResults(1).uniqueResult();
	}

}

package com.fanglin.customer.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.AdvanceDao;
import com.fanglin.payment.po.AdvancePaymentPO;

@Repository("advanceOrderDao")
public class AdvanceDaoImpl extends DaoImpl<AdvancePaymentPO> implements AdvanceDao {
	
	public AdvanceDaoImpl(){
		super(AdvancePaymentPO.class);
	}

	@Override
	public AdvancePaymentPO queryCusAdvance(long customerId,int company) {
		
		return (AdvancePaymentPO) session().createCriteria(AdvancePaymentPO.class).createAlias("customer", "customer").add(Restrictions.eq("customer.cid", customerId)).add(Restrictions.eq("company",company)).uniqueResult();
	}

}

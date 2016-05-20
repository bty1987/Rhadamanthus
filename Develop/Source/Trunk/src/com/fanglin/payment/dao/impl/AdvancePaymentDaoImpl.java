/**
 * @File Name		: AdvancePaymentDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;

@Repository("advancePaymentDao")
public class AdvancePaymentDaoImpl extends DaoImpl<AdvancePaymentPO> implements AdvancePaymentDao {
	
	public AdvancePaymentDaoImpl() {
		super(AdvancePaymentPO.class);
	}

	@Override
	public AdvancePaymentPO queryAdvancePaymentByCustomerId(int customerId) {
		return (AdvancePaymentPO) session().createCriteria(AdvancePaymentPO.class).createAlias("customer", "customer").add(Restrictions.eq(AdvancePaymentPO.COLUMN_CUSTOMERID_STR, customerId)).uniqueResult();
	}

}

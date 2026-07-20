package com.fanglin.payment.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.SalesReceiptDao;
import com.fanglin.payment.po.SalesReceiptPO;

@Repository("salesReceiptDao")
public class SalesReceiptDaoImpl  extends DaoImpl<SalesReceiptPO> implements SalesReceiptDao{

	public SalesReceiptDaoImpl(){
		super(SalesReceiptPO.class);
	}
	
	@Override
	public SalesReceiptPO querySalesReceiptBySrId(long srId) {
		return (SalesReceiptPO) session().createCriteria(SalesReceiptPO.class).add(Restrictions.eq(SalesReceiptPO.COLUMN_SRID_STR, srId)).setMaxResults(1).uniqueResult();
	}
}

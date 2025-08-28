package com.fanglin.payment.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.OalesReceiptDao;
import com.fanglin.payment.po.OalesReceiptPO;

@Repository("oalesReceiptDao")
public class OalesReceiptDaoImpl  extends DaoImpl<OalesReceiptPO> implements OalesReceiptDao{

	public OalesReceiptDaoImpl(){
		super(OalesReceiptPO.class);
	}
	
	@Override
	public OalesReceiptPO queryOalesReceipt(long orid) {
		return (OalesReceiptPO) session().createCriteria(OalesReceiptPO.class).add(Restrictions.eq(OalesReceiptPO.COLUMN_SRID_STR, orid)).uniqueResult();
	}
}

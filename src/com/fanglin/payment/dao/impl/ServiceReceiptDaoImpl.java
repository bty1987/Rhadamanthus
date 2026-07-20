package com.fanglin.payment.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.ServiceReceiptDao;
import com.fanglin.payment.po.ServiceReceiptPO;

@Repository("serviceReceiptDao")
public class ServiceReceiptDaoImpl extends DaoImpl<ServiceReceiptPO> implements ServiceReceiptDao {

	public ServiceReceiptDaoImpl(){
		super(ServiceReceiptPO.class);
	}
	
	@Override
	public ServiceReceiptPO queryServiceReceiptBySrId(long srId) {
		return (ServiceReceiptPO) session().createCriteria(ServiceReceiptPO.class).add(Restrictions.eq(ServiceReceiptPO.COLUMN_SRID_STR, srId)).setMaxResults(1).uniqueResult();
	}
}

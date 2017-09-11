package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.PaymentScaleDao;
import com.fanglin.data.po.PaymentScalePO;

@Repository("paymentScaleDao")
public class PaymentScaleDaoImpl extends DaoImpl<PaymentScalePO> implements PaymentScaleDao  {

	public PaymentScaleDaoImpl(){
		super(PaymentScalePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PaymentScalePO> queryPaymentScaleByCid(int cid ) {
		
		return createCriteria(PaymentScalePO.class).add(Restrictions.eq("cid", cid)).list();
	}
	
}

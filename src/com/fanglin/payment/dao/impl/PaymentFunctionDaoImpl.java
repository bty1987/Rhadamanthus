package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.PaymentFunctionDao;
import com.fanglin.payment.po.PaymentFunctionPO;

@Repository("paymentFunctionDao")
public class PaymentFunctionDaoImpl extends DaoImpl<PaymentFunctionPO> implements PaymentFunctionDao {

	public PaymentFunctionDaoImpl(){
		super(PaymentFunctionPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentFunctionPO> queryPaymentFunction(Short type) {
		
		Criteria criteria = session().createCriteria(PaymentFunctionPO.class).add(Restrictions.eq("status", PaymentFunctionPO.STATUS_ENABLE_INT));
		
		if(type != null){
			criteria.add(Restrictions.eq("type", type));
		}
		
		return criteria.list();
	}

}

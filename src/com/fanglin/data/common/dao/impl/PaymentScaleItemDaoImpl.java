package com.fanglin.data.common.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.PaymentScaleItemDao;
import com.fanglin.data.po.PaymentScaleItemPO;

@Repository("paymentScaleItemDao")
public class PaymentScaleItemDaoImpl  extends DaoImpl<PaymentScaleItemPO> implements PaymentScaleItemDao {

	public PaymentScaleItemDaoImpl(){
		super(PaymentScaleItemPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<PaymentScaleItemPO> queryPaymentScaleItemByPsid(long psid) {
		
		return session().createCriteria(PaymentScaleItemPO.class).add(Restrictions.eq("psid", psid)).list();
	}

}

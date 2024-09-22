package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.PaymentScaleDao;
import com.fanglin.data.po.PaymentScalePO;

@Repository("paymentScaleDao")
public class PaymentScaleDaoImpl extends DaoImpl<PaymentScalePO> implements PaymentScaleDao {

	public PaymentScaleDaoImpl() {
		super(PaymentScalePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<PaymentScalePO> queryPaymentScaleByCid(int cid, Short typeness, Short atttype) {

		Criteria criteria = session().createCriteria(PaymentScalePO.class).add(Restrictions.eq("cid", cid));

		if (typeness != null) criteria.add(Restrictions.eq("typeness", typeness));

		if (atttype != null) criteria.add(Restrictions.eq("atttype", atttype));

		return criteria.list();
	}

}

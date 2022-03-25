package com.fanglin.customer.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PaymentDao;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

@Repository("paymentOrderDao")
public class PaymentDaoImpl extends DaoImpl<PaymentPO> implements PaymentDao {

	public PaymentDaoImpl() {
		super(PaymentPO.class);
	}

	@Override
	public List<PaymentPO> queryCusPayment(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<PaymentPO> query = pagingQuery(paging, PaymentPO.class);

		query.add(query.getCriterion("orderId", orderId, "eq"));

		query.desc("createTime");

		return query.list();
	}

}

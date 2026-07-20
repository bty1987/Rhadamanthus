package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaymentContractDao;
import com.fanglin.payment.po.PaymentContractPO;
import com.fanglin.utils.Paging;

@Repository("paymentContractDao")
public class PaymentContractDaoImpl extends DaoImpl<PaymentContractPO> implements PaymentContractDao {

	public PaymentContractDaoImpl() {
		super(PaymentContractPO.class);
	}

	@Override
	public PaymentContractPO queryPaymentContract(long rtid, short type) {
		return (PaymentContractPO) session().createCriteria(PaymentContractPO.class).add(Restrictions.eq("rtid", rtid)).add(Restrictions.eq("paymentType", type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public List<PaymentContractPO> pagePaymentContract(Paging paging, List<Filter> filters) {

		PagingQuery<PaymentContractPO> query = pagingQuery(paging, PaymentContractPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<PaymentContractPO> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("creater", "creater");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(filter.getField())) {
				query.add(query.getCriterion("orderId", (filter.getData()), filter.getOp()));
			} else if ("paymentType".equals(field)) {
				query.add(query.getCriterion("paymentType", Short.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges(field, field, data);
			} else if ("creater".equals(field)) {
				query.add(Restrictions.eq("creater.userId", data));
			}
		}

	}

}

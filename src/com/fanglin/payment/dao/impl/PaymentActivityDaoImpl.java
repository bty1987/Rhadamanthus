package com.fanglin.payment.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.PaymentActivityDao;
import com.fanglin.payment.po.PaymentActivityPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("paymentActivityDao")
public class PaymentActivityDaoImpl extends DaoImpl<PaymentActivityPO> implements PaymentActivityDao {

	public PaymentActivityDaoImpl() {
		super(PaymentActivityPO.class);
	}

	@Override
	public List<PaymentActivityPO> pagePaymentActivity(Paging paging, List<Filter> filters) {

		PagingQuery<PaymentActivityPO> query = pagingQuery(paging, PaymentActivityPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public int amountPaymentActivity(String orderId, Short type) {

		String sql = "select sum(pa.realMoney * pa.multiple) from payment.paymentActivity pa where pa.orderId = :orderId and pa.type = :type";
		String amount = String.valueOf(session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).uniqueResult());

		return amount == null ? 0 : Arith.div(Integer.parseInt(amount), 1000000);
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (PaymentActivityPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(PaymentActivityPO.COLUMN_ORDERID_STR, data, op));
			} else if (PaymentActivityPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(PaymentActivityPO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if (PaymentActivityPO.COLUMN_ACTIVITY_STR.equals(field)) {
				query.alias("activity", "activity");
				query.add(query.getCriterion(PaymentActivityPO.COLUMN_ACTIVITY_STR, Integer.valueOf(data), op));
			} else if (PaymentActivityPO.COLUMN_CREATETIME_STR.equals(field)) {
				query.timeranges(PaymentActivityPO.COLUMN_CREATETIME_STR, PaymentActivityPO.COLUMN_CREATETIME_STR, data);
			}
		}
	}
}

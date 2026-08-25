/**
 * Title: PaymentDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.payment.dao.impl;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.po.PaymentDO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.utils.Paging;

@Repository("paymentDao")
public class PaymentDaoImpl extends DaoImpl<PaymentPO> implements PaymentDao {

	public PaymentDaoImpl() {
		super(PaymentPO.class);
	}

	@Override
	public List<PaymentDO> pagePayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<PaymentDO> query = pagingQuery(paging, PaymentDO.class);

		queryFilterExcute(query, filters);

		query.desc("pid");

		return query.list();
	}

	@Override
	public List<PaymentPO> queryPayment(List<Filter> filters) throws FLException {

		PagingQuery<PaymentPO> query = pagingQuery(new Paging(), PaymentPO.class);

		queryFilterExcute(query, filters);
		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PaymentPO> queryPaymentByOrderId(String orderId) {
		return session().createCriteria(PaymentPO.class).add(Restrictions.eq("orderId", String.valueOf(orderId))).list();
	}

	@Override
	public int amountPayment(String orderId, Short type, Short paymentType, Short[] status) {

		String sql = "SELECT SUM(p.recharge) FROM payment.payment p WHERE p.orderId = :orderId AND p.type = :type AND p.paymentType = :paymentType AND `status` IN :status";

		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setShort("paymentType", paymentType).setParameterList("status", status).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.intValue();
	}

	@Override
	public int amountPayment(String orderId, Short paymentType, Timestamp collectTime) {

		String sql = "SELECT SUM(IF(p.type in (1, 3), p.recharge, -p.recharge)) FROM payment.payment p, payment.advancereceipt ar WHERE p.orderId = :orderId AND p.paymentType = :paymentType AND p.status IN (1, 2) AND p.arid = ar.arid AND ar.collectTime <= :collectTime";

		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("paymentType", paymentType).setTimestamp("collectTime", collectTime).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.intValue();
	}

	@Override
	public long balancePayment(String orderId, Short paymentType) {

		// 对账核算基线: 收款(1)/退回(3)为正, 提现(0)/付款(2)为负; 仅计入已收款(1)/已确认(2), 排除初始(0)/已撤销(3)
		String sql = "SELECT SUM(IF(p.type in (1, 3), p.recharge, -p.recharge)) FROM payment.payment p WHERE p.orderId = :orderId AND p.paymentType = :paymentType AND p.status IN (1, 2)";

		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("paymentType", paymentType).uniqueResult();

		return sqlQuery == null ? 0L : sqlQuery.longValue();
	}

	@Override
	public PaymentDO queryPaymentByReceiptId(long arId) {
		return (PaymentDO) session().createCriteria(PaymentDO.class).createAlias("advanceReceipt", "advanceReceipt").add(Restrictions.eq("advanceReceipt.arId", arId)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int updatePaymentForAid(String orderId, short paymentType, long aid) {
		String hql = "update PaymentPO set aid = :aid where orderId = :orderId and paymentType = :paymentType";
		return session().createQuery(hql).setLong("aid", aid).setString("orderId", orderId).setShort("paymentType", paymentType).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		query.alias("customer", "customer");

		for (Filter filter : filters) {

			if ("customerId".equals(filter.getField())) {
				query.add(query.getCriterion("customer.no", filter));
			} else if ("customerName".equals(filter.getField())) {
				query.add(query.getCriterion("customer.customerName", filter));
			} else if ("collectTime".equals(filter.getField())) {
				query.alias("advanceReceipt", "advanceReceipt");
				query.timeranges("advanceReceipt.collectTime", "advanceReceipt.collectTime", filter.getData());
			} else if ("confirmTime".equals(filter.getField())) {
				query.alias("advanceReceipt", "advanceReceipt");
				query.timeranges("advanceReceipt.confirmTime", "advanceReceipt.confirmTime", filter.getData());
			} else if ("status".equals(filter.getField())) {
				query.add(query.getCriterion("status", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("paymentType".equals(filter.getField())) {
				query.add(query.getCriterion("paymentType", Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("company".equals(filter.getField())) {
				query.add(query.getCriterion("company", Integer.valueOf(filter.getData()), filter.getOp()));
			}
		}
	}

}

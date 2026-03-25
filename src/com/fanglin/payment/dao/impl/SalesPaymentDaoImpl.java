package com.fanglin.payment.dao.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.SalesPaymentPO;
import com.fanglin.sales.dao.impl.SalesDaoImpl;
import com.fanglin.utils.Paging;

@Repository("salesPaymentDao")
public class SalesPaymentDaoImpl extends DaoImpl<SalesPaymentPO> implements SalesPaymentDao {

	public SalesPaymentDaoImpl() {
		super(SalesPaymentPO.class);
	}

	@Override
	public List<SalesPaymentPO> pageSalesPayment(Paging paging, List<Filter> filters, Short type) throws FLException {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		query.add(Restrictions.eq(SalesPaymentPO.COLUMN_TYPE_STR, type));

		return query.list();
	}

	@Override
	public List<SalesPaymentPO> pageSalesPayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<SalesPaymentPO> query = pagingQuery(paging, SalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<SalesPaymentPO> querySalesPaymentByOrderId(String orderId, List<Filter> filters) throws FLException {

		PagingQuery<SalesPaymentPO> query = pagingQuery(new Paging(), SalesPaymentPO.class);

		if (orderId != null && orderId != "") {
			query.alias("sales", "sales").add(Restrictions.eq(SalesPaymentPO.COLUMN_SALES_ORDERID_STR, orderId));
		}

		queryFilterExecute(query, filters);
		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentsBySid(long sid) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", Long.valueOf(sid))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.in("sales.sid", sids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentBySids(List<Long> sids, List<Short> status) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.in("sales.sid", sids)).add(Restrictions.in(SalesPaymentPO.COLUMN_STATUS_STR, status)).list();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPaymentPO> querySalesPaymentBySrid(long srid) {
		return session().createCriteria(SalesPaymentPO.class).createAlias("salesReceipt", "salesReceipt").add(Restrictions.eq("salesReceipt.srId", srid)).add(Restrictions.sqlRestriction(" status!=0")).list();
	}

	@Override
	public SalesPaymentPO querySalesPayment(long sid, List<Short> types) {
		return (SalesPaymentPO) session().createCriteria(SalesPaymentPO.class).createAlias("sales", "sales").add(Restrictions.eq(SalesPaymentPO.COLUMN_SALES_SID_STR, sid)).add(Restrictions.in(SalesPaymentPO.COLUMN_TYPE_STR, types)).uniqueResult();
	}

	@Override
	public SalesPaymentPO querySalesPaymentByRid(long rid) {
		return (SalesPaymentPO) session().createCriteria(SalesPaymentPO.class).createAlias("salesRefunds", "refund").add(Restrictions.eq("refund.rid", rid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countSalesPayment(long sid, List<Short> types) {

		StringBuffer sql = new StringBuffer();
		sql.append("select count(*) from payment.salespayment where sid =:sid");

		if (types != null && types.size() > 0) {
			sql.append(" and type in :types");
		}

		Query query = session().createSQLQuery(sql.toString()).setLong("sid", sid);

		if (types != null && types.size() > 0) {
			query.setParameterList("types", types);
		}

		BigInteger num = (BigInteger) query.uniqueResult();

		return num.intValue();
	}

	@Override
	public long amountSalesPayment(String orderId) {

		String sql = "select sum(if(sp.type in (2, 3, 8), sp.referMoney, -sp.refermoney)) from payment.salespayment sp, sales.sales s where s.orderId = :orderId and s.sid = sp.sid and sp.status != 0 and ((s.type = 1 and s.balancestatus = 3) or s.type = 0)";
		BigDecimal sqlQuery = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return sqlQuery == null ? 0 : sqlQuery.longValue();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("collectTime".equals(field)) {
				query.alias("salesReceipt", "salesReceipt");

				if ("between".equals(op)) {
					query.timeranges(SalesPaymentPO.COLUMN_COLLECTTIME_STR, SalesPaymentPO.COLUMN_COLLECTTIME_STR, data);
				} else {
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_COLLECTTIME_STR, data, op));
				}
			} else if ("confirmTime".equals(field)) {

				query.alias("salesReceipt", "salesReceipt");

				if ("between".equals(op)) {
					query.timeranges(SalesPaymentPO.COLUMN_CONFIRMTIME_STR, SalesPaymentPO.COLUMN_CONFIRMTIME_STR, data);
				} else {
					query.add(query.getCriterion(SalesPaymentPO.COLUMN_CONFIRMTIME_STR, data, op));
				}
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			} else if ("type".equals(field)) {
				List<Short> type = JSONArray.parseArray(data, Short.class);
				query.add(query.getCriterion(field, type, op));
			} else if ("refunds.isAffirm".equals(field)) {
				query.alias("salesRefunds", "refunds").add(query.getCriterion("refunds.isAffirm", Short.valueOf(data), op));
			} else if ("refunds.affirmTime.range".equals(field)) {
				query.alias("salesRefunds", "refunds");
				query.timeranges("refunds.affirmTime", filter.getData());
			}
		}
	}
}

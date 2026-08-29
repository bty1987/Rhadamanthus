package com.fanglin.payment.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.OalesPaymentDao;
import com.fanglin.payment.po.OalesPaymentPO;
import com.fanglin.sales.dao.impl.OalesDaoImpl;
import com.fanglin.utils.Paging;

@Repository("oalesPaymentDao")
public class OalesPaymentDaoImpl extends DaoImpl<OalesPaymentPO> implements OalesPaymentDao {

	public OalesPaymentDaoImpl() {
		super(OalesPaymentPO.class);
	}

	@Override
	public List<OalesPaymentPO> pageOalesPayment(Paging paging, List<Filter> filters, Short type) throws FLException {

		PagingQuery<OalesPaymentPO> query = pagingQuery(paging, OalesPaymentPO.class);

		queryFilterExecute(query, filters);

		query.add(Restrictions.eq(OalesPaymentPO.COLUMN_TYPE_STR, type));

		return query.list();
	}

	@Override
	public List<OalesPaymentPO> pageOalesPayment(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<OalesPaymentPO> query = pagingQuery(paging, OalesPaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<OalesPaymentPO> queryOalesPaymentByOrderId(String orderId, List<Filter> filters) throws FLException {

		PagingQuery<OalesPaymentPO> query = pagingQuery(new Paging(), OalesPaymentPO.class);

		if (orderId != null && orderId != "") {
			query.add(Restrictions.eq(OalesPaymentPO.COLUMN_ORDERID_STR, orderId));
		}

		queryFilterExecute(query, filters);
		query.notPaging();

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPaymentPO> queryOalesPaymentsByOid(long oid) {
		return session().createCriteria(OalesPaymentPO.class).createAlias("oales", "oales").add(Restrictions.eq("oales.oid", Long.valueOf(oid))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPaymentPO> queryOalesPaymentByOids(List<Long> oids) {
		return session().createCriteria(OalesPaymentPO.class).createAlias("oales", "oales").add(Restrictions.in("oales.oid", oids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPaymentPO> queryOalesPaymentForNotInitByOrid(long orid) {
		return session().createCriteria(OalesPaymentPO.class).createAlias("oalesReceipt", "oalesReceipt").add(Restrictions.eq("oalesReceipt.orid", orid)).add(Restrictions.sqlRestriction(" status!=0")).list();
	}

	@Override
	public OalesPaymentPO queryOalesPayment(long osid) {
		return (OalesPaymentPO) session().createCriteria(OalesPaymentPO.class).add(Restrictions.eq("osid", osid)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		OalesDaoImpl.queryFilterExecute(query, filters, "oales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (OalesPaymentPO.COLUMN_ORDERID_STR.equals(field)) {
				query.add(query.getCriterion(OalesPaymentPO.COLUMN_ORDERID_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("collectTime".equals(field)) {
				query.alias("oalesReceipt", "oalesReceipt");

				if ("between".equals(op)) {
					query.timeranges(OalesPaymentPO.COLUMN_COLLECTTIME_STR, OalesPaymentPO.COLUMN_COLLECTTIME_STR, data);
				} else {
					query.add(query.getCriterion(OalesPaymentPO.COLUMN_COLLECTTIME_STR, data, op));
				}
			} else if ("confirmTime".equals(field)) {

				query.alias("oalesReceipt", "oalesReceipt");

				if ("between".equals(op)) {
					query.timeranges(OalesPaymentPO.COLUMN_CONFIRMTIME_STR, OalesPaymentPO.COLUMN_CONFIRMTIME_STR, data);
				} else {
					query.add(query.getCriterion(OalesPaymentPO.COLUMN_CONFIRMTIME_STR, data, op));
				}
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(field, Integer.valueOf(data), op));
			} else if ("type".equals(field)) {
				List<Short> type = JSONArray.parseArray(data, Short.class);
				query.add(query.getCriterion(field, type, op));
			}
		}
	}

}

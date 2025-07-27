package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.utils.Paging;

@Repository("salesBalanceDao")
public class SalesBalanceDaoImpl extends DaoImpl<SalesBalancePO> implements SalesBalanceDao {

	public SalesBalanceDaoImpl() {
		super(SalesBalancePO.class);
	}

	@Override
	public List<SalesBalancePO> pageSalesBalance(Paging paging, List<Filter> filters, Short type, int company) throws FLException {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESCOMPANY_STR, company, "eq"));

		if (type != null) {
			query.add(query.getCriterion("sales.type", type, "eq"));
		}

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForDompany(Paging paging, List<Filter> filters, Short type, int dompany) throws FLException {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESDOMPANY_STR, dompany, "eq"));

		if (type != null) {
			query.add(query.getCriterion("sales.type", type, "eq"));
		}

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForPompany(Paging paging, List<Filter> filters, Short type, int pompany) throws FLException {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESPOMPANY_STR, pompany, "eq"));

		if (type != null) {
			query.add(query.getCriterion("sales.type", type, "eq"));
		}

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForSupplier(Paging paging, List<Filter> filters, int pompany, int uid) throws FLException {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(Restrictions.or(query.alias("sales.supplier", "supplier").getCriterion("supplier.uid", uid, "eq"), query.alias("sales.brand", "brand").getCriterion("brand.supplier.uid", uid, "eq")));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForCheck(Paging paging, List<Filter> filters, Short type, int pompany) throws FLException {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESPOMPANY_STR, pompany, "eq"));

		if (type != null) {
			query.add(query.getCriterion("sales.type", type, "eq"));
		}

		query.add(query.getCriterion("status", SalesBalancePO.STATUS_BALANCE_INT, "eq"));
		query.add(query.getCriterion("checkStatus", SalesBalancePO.CHECKSTATUS_INIT_INT, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public SalesBalancePO querySalesBalance(long sid, short type, short onetype) {
		return (SalesBalancePO) session().createCriteria(SalesBalancePO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", sid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("onetype", onetype)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {
		queryFilterExcute(query, filters, "");
	}

	private static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (SalesBalancePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(SalesBalancePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if (SalesBalancePO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(SalesBalancePO.COLUMN_TYPE_STR, Short.valueOf(data), op));
			} else if (SalesBalancePO.COLUMN_DELIVERSTATUS_STR.equals(field)) {
				query.add(query.getCriterion(SalesBalancePO.COLUMN_DELIVERSTATUS_STR, Short.valueOf(data), op));
			} else if (SalesBalancePO.COLUMN_VERIFYSTATUS_STR.equals(field)) {
				query.add(query.getCriterion(SalesBalancePO.COLUMN_VERIFYSTATUS_STR, Short.valueOf(data), op));
			} else if (SalesBalancePO.COLUMN_CONFIRMSTATUS_STR.equals(field)) {
				query.add(query.getCriterion(SalesBalancePO.COLUMN_CONFIRMSTATUS_STR, Short.valueOf(data), op));
			} else if (SalesBalancePO.COLUMN_CREATETIME_STR.equals(field)) {
				query.timeranges(SalesBalancePO.COLUMN_CREATETIME_STR, filter.getData());
			} else if (SalesBalancePO.COLUMN_VENDERTIME_STR.equals(field)) {
				query.timeranges(SalesBalancePO.COLUMN_VENDERTIME_STR, filter.getData());
			} else if (SalesBalancePO.COLUMN_POSTTIME_STR.equals(field)) {
				query.timeranges(SalesBalancePO.COLUMN_POSTTIME_STR, filter.getData());
			}
		}
	}
}

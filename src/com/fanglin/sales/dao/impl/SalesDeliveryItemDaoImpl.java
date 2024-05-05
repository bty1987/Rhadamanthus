package com.fanglin.sales.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesDeliveryItemDao;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.utils.Paging;

@Repository("salesDeliveryItemDao")
public class SalesDeliveryItemDaoImpl extends DaoImpl<SalesDeliveryItemPO> implements SalesDeliveryItemDao {

	public SalesDeliveryItemDaoImpl() {
		super(SalesDeliveryItemPO.class);
	}

	@Override
	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<SalesDeliveryItemPO> query = pagingQuery(paging, SalesDeliveryItemPO.class);

		query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdiid");

		return query.list();
	}

	@Override
	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, int uid) throws FLException {

		PagingQuery<SalesDeliveryItemPO> query = pagingQuery(paging, SalesDeliveryItemPO.class);

		query.alias("sales", "sales").alias("sales.supplier", "supplier").add(query.getCriterion(SalesPO.COLUMN_OCUID_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdiid");

		return query.list();
	}

	@Override
	public List<SalesDeliveryItemPO> pageSalesDeliveryItemForInstorer(Paging paging, List<Filter> filters, int company, int uid) throws FLException {

		PagingQuery<SalesDeliveryItemPO> query = pagingQuery(paging, SalesDeliveryItemPO.class);

		query.alias("sales", "sales").alias("sales.instorer", "instorer").add(query.getCriterion(SalesPO.COLUMN_IUID_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdiid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesDeliveryItemPO> querySalesDeliveryItem(long sid) {
		return session().createCriteria(SalesDeliveryItemPO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", sid)).list();
	}

	@Override
	public SalesDeliveryItemPO querySalesDeliveryItemBySiid(Long siid) {
		return (SalesDeliveryItemPO) session().createCriteria(SalesDeliveryItemPO.class).add(Restrictions.eq(SalesDeliveryItemPO.COLUMN_SIID_LONG, siid)).uniqueResult();
	}

	@Override
	public int countSalesDeliveryItem(long sid, short status) {

		String sql = "SELECT count(*) FROM sales.salesdeliveryitem where sid = :sid and status < :status";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).setShort("status", status).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<SalesDeliveryItemPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("statuses".equals(field)) {
				query.add(query.getCriterion("status", filter.getShorts(), "in"));
			} else if (SalesDeliveryItemPO.COLUMN_CREATETIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CREATETIME_STR, filter.getData());
			} else if (SalesDeliveryItemPO.COLUMN_TRANTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_TRANTIME_STR, filter.getData());
			} else if (SalesDeliveryItemPO.COLUMN_CHECKTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CHECKTIME_STR, filter.getData());
			} else if (SalesDeliveryItemPO.COLUMN_CONFIRMTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CONFIRMTIME_STR, filter.getData());
			} else if (SalesDeliveryItemPO.COLUMN_FINISHTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_FINISHTIME_STR, filter.getData());
			} else if (SalesDeliveryItemPO.COLUMN_GOODSNAME_STR.equals(field)) {
				query.alias("salesItem", "salesItem");
				query.alias("salesItem.goods", "goods");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_GOODSNAME_STR, data, op));
			} else if ("traner".equals(field)) {
				query.alias("traner", "traner");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_TRANERID_STR, data, op));
			} else if (SalesDeliveryItemPO.COLUMN_STATUS_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_STATUS_STR, filter.getData());
			} else if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_CREATEID_STR, data, op));
			} else if ("checker".equals(field)) {
				query.alias("checker", "checker");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_CHECKER_STR, data, op));
			} else if ("confirmer".equals(field)) {
				query.alias("confirmer", "confirmer");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_CONFIRMER_STR, data, op));
			} else if ("finisher".equals(field)) {
				query.alias("finisher", "finisher");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_FINISHER_STR, data, op));
			}
		}
	}
}

package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
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
	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SalesDeliveryItemPO> query = pagingQuery(paging, SalesDeliveryItemPO.class);

		query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdiid");

		return query.list();

	}

	@Override
	public List<SalesDeliveryItemPO> pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, int company, int uid) {

		PagingQuery<SalesDeliveryItemPO> query = pagingQuery(paging, SalesDeliveryItemPO.class);

		query.alias("sales", "sales").alias("sales.supplier", "supplier").add(query.getCriterion(SalesPO.COLUMN_OCUID_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdiid");

		return query.list();
	}

	@Override
	public SalesDeliveryItemPO querySalesDeliveryItemBySiid(Long siid) {
		return (SalesDeliveryItemPO) session().createCriteria(SalesDeliveryItemPO.class).add(Restrictions.eq(SalesDeliveryItemPO.COLUMN_SIID_LONG, siid)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<SalesDeliveryItemPO> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("sales", "sales");

			if (SalesDeliveryItemPO.COLUMN_SALESNO_STR.equals(field)) {
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_SALESNO_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if (SalesDeliveryItemPO.COLUMN_SALESBRAND_STR.equals(field)) {
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_SALESBRAND_STR, data, op));
			} else if (SalesDeliveryItemPO.COLUMN_SALESORDERID_STR.equals(field)) {
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_SALESORDERID_STR, data, op));
			} else if (SalesDeliveryItemPO.COLUMN_SALESCATEGROY_STR.equals(field)) {
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_SALESCATEGROY_STR, data, op));
			}else if (SalesDeliveryItemPO.COLUMN_CREATETIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CREATETIME_STR, filter.getData());
			}else if (SalesDeliveryItemPO.COLUMN_TRANTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_TRANTIME_STR, filter.getData());
			}else if (SalesDeliveryItemPO.COLUMN_CHECKTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CHECKTIME_STR, filter.getData());
			}else if (SalesDeliveryItemPO.COLUMN_CONFIRMTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_CONFIRMTIME_STR, filter.getData());
			}else if (SalesDeliveryItemPO.COLUMN_FINISHTIME_STR.equals(field)) {
				query.timeranges(SalesDeliveryItemPO.COLUMN_FINISHTIME_STR, filter.getData());
			}else if (SalesDeliveryItemPO.COLUMN_GOODSNAME_STR.equals(field)) {
				query.alias("salesItem", "salesItem");
				query.alias("salesItem.goods", "goods");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_GOODSNAME_STR, data, op));
			} else if ("traner".equals(field)) {
				query.alias("traner", "traner");
				query.add(query.getCriterion(SalesDeliveryItemPO.COLUMN_TRANERID_STR, data, op));
			}
		}
	}
}

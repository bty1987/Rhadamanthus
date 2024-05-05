package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.utils.Paging;

@Repository("oalesDao")
public class OalesDaoImpl extends DaoImpl<OalesPO> implements OalesDao {

	public OalesDaoImpl() {
		super(OalesPO.class);
	}

	@Override
	public List<OalesPO> pageOales(Paging paging, List<Filter> filters, List<Short> statuses, int company) throws FLException {

		PagingQuery<OalesPO> query = pagingQuery(paging, OalesPO.class);

		query.add(query.getCriterion(OalesPO.COLUMN_COMPANY_STR, company, "eq"));

		if (statuses != null) {
			query.add(Restrictions.in("status", statuses));
		}

		queryFilterExcute(query, filters);

		query.desc("oid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<OalesPO> queryOalesByOrderId(String orderId) {
		return session().createCriteria(OalesPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}

	private void queryFilterExcute(PagingQuery<OalesPO> query, List<Filter> filters) throws FLException {
		queryFilterExecute(query, filters, "");
	}

	public static void queryFilterExecute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;

		if (prefix == null) {
			prefix = "";
		}

		if (!"".equals(prefix)) {

			query.alias(prefix, prefix);
			prefix = String.format("%s.", prefix);
		}

		DecorationDaoImpl.queryFilterExcute(query, filters, String.format("%sdecoration", prefix));

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.contains("dept")) {
				query.alias("dept", "dept");
			} else if (field.contains("region")) {
				query.alias("region", "region");
			}

			if ("oales.no".equals(field)) {
				query.add(query.getCriterion(String.format("%sno", prefix), data, op));
			} else if ("oales.createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("oales.status".equals(field)) {
				query.add(query.getCriterion(String.format("%sstatus", prefix), Short.valueOf(data), op));
			} else if ("oales.brand.bid".equals(field)) {
				query.add(query.getCriterion(String.format("%sbid", prefix), Long.valueOf(data), op));
			} else if ("oales.category".equals(field)) {
				query.add(query.getCriterion(String.format("%scategory", prefix), data, op));
			} else if ("oales.confirmTime".equals(field)) {
				query.timeranges("confirmTime", data);
			} else if ("oales.region.no".equals(field)) {
				query.add(query.getCriterion("region.no", data, op));
			} else if ("oales.dept.no".equals(field)) {
				query.add(query.getCriterion("dept.no", data, op));
			}
		}
	}
}

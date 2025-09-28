package com.fanglin.sales.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesDeliveryDao;
import com.fanglin.sales.po.SalesDeliveryPO;
import com.fanglin.utils.Paging;

@Repository("SalesDeliveryDao")
public class SalesDeliveryDaoImpl extends DaoImpl<SalesDeliveryPO> implements SalesDeliveryDao {

	public SalesDeliveryDaoImpl() {
		super(SalesDeliveryPO.class);
	}

	@Override
	public List<SalesDeliveryPO> pageSalesDelivery(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<SalesDeliveryPO> query = pagingQuery(paging, SalesDeliveryPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sdid");

		return query.list();
	}

	@Override
	public SalesDeliveryPO querySalesDelivery(long sid) {
		return (SalesDeliveryPO) session().createCriteria(SalesDeliveryPO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", sid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countSalesDelivery(long sid) {

		String sql = "SELECT count(*) FROM sales.salesdelivery where sid = :sid";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("sid", sid).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<SalesDeliveryPO> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		SalesDaoImpl.queryFilterExcute(query, filters, "sales");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}
}

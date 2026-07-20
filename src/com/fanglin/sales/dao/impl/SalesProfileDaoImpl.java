package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesProfileDao;
import com.fanglin.sales.po.SalesProfilePO;
import com.fanglin.utils.Paging;

@Repository("salesProfileDao")
public class SalesProfileDaoImpl extends DaoImpl<SalesProfilePO> implements SalesProfileDao {

	public SalesProfileDaoImpl() {
		super(SalesProfilePO.class);
	}

	@Override
	public List<SalesProfilePO> pageSalesProfile(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SalesProfilePO> query = pagingQuery(paging, SalesProfilePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("spid");

		return query.list();
	}

	@Override
	public SalesProfilePO querySalesProfileByOrderId(String orderId) {
		return (SalesProfilePO) session().createCriteria(SalesProfilePO.class).add(Restrictions.eq("orderId", orderId)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}

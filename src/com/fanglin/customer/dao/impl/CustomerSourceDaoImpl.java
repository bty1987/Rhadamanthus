package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.utils.Paging;

@Repository("customerSourceDao")
public class CustomerSourceDaoImpl extends DaoImpl<CustomerSourcePO> implements CustomerSourceDao {

	public CustomerSourceDaoImpl() {
		super(CustomerSourcePO.class);
	}

	@Override
	public List<CustomerSourcePO> pageCustomerSource(Paging paging, List<Filter> filters) {

		PagingQuery<CustomerSourcePO> query = pagingQuery(paging, CustomerSourcePO.class);

		queryFilterExcute(query, filters);

		query.desc("csid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("phone".equals(field)) {
				query.add(query.getCriterion("phone", data, op));
			} else if ("creater".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_CREATER_STR, Integer.valueOf(data)));
			} else if ("designer".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_DESIGNER_STR, Integer.valueOf(data)));
			} else if ("salesman".equals(field)) {
				query.add(Restrictions.eq(CustomerSourcePO.COLUMN_SALESMAN_STR, Integer.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("village".equals(field)) {
				query.alias("village", "village");
				query.add(query.getCriterion("village.no", String.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			}
		}

	}
}

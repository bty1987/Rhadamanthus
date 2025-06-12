package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Hibernate;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.utils.Paging;

@Repository("customerOriginDao")
public class CustomerOriginDaoImpl extends DaoImpl<CustomerOriginPO> implements CustomerOriginDao {

	public CustomerOriginDaoImpl() {
		super(CustomerOriginPO.class);
	}

	@Override
	public List<CustomerOriginPO> pageCustomerOrigin(Paging paging, List<Filter> filters, List<Integer> dids) {

		PagingQuery<CustomerOriginPO> query = pagingQuery(paging, CustomerOriginPO.class);

		if (dids != null && dids.size() > 0) {
			query.alias("department", "department");
			query.add(query.getCriterion("department.did", dids, "in"));
		}

		queryFilterExcute(query, filters);

		query.desc("csid");

		return query.list();
	}

	@SuppressWarnings("deprecation")
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("phone".equals(field)) {
				query.add(query.getCriterion("phone", data, op));
			} else if ("creater".equals(field)) {
				query.add(Restrictions.eq(CustomerOriginPO.COLUMN_CREATER_STR, Integer.valueOf(data)));
			} else if ("belonger".equals(field)) {
				query.add(Restrictions.eq(CustomerOriginPO.COLUMN_BELONGER_STR, Integer.valueOf(data)));
			} else if ("belonger.uid".equals(field)) {
				query.add(Restrictions.sqlRestriction("buid is ? ", null, Hibernate.STRING));
			} else if ("designer".equals(field)) {
				query.add(Restrictions.eq(CustomerOriginPO.COLUMN_DESIGNER_STR, Integer.valueOf(data)));
			} else if ("salesman".equals(field)) {
				query.add(Restrictions.eq(CustomerOriginPO.COLUMN_SALESMAN_STR, Integer.valueOf(data)));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("village".equals(field)) {
				query.alias("village", "village");
				query.add(query.getCriterion("village.no", String.valueOf(data), op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("source".equals(field)) {
				query.add(query.getCriterion("source", data, op));
			} else if ("contact".equals(field)) {
				query.add(query.getCriterion("contact", data, op));
			} else if ("referOrderId".equals(field)) {
				query.add(query.getCriterion("referOrderId", data, op));
			}
		}
	}
}

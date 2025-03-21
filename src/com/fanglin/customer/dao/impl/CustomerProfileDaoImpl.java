package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerProfileDao;
import com.fanglin.customer.po.CustomerProfilePO;
import com.fanglin.utils.Paging;

@Repository("customerProfileDao")
public class CustomerProfileDaoImpl extends DaoImpl<CustomerProfilePO> implements CustomerProfileDao {

	public CustomerProfileDaoImpl() {
		super(CustomerProfilePO.class);
	}

	@Override
	public List<CustomerProfilePO> pageCustomerProfile(Paging paging, List<Filter> filters, int company) {
		PagingQuery<CustomerProfilePO> query = pagingQuery(paging, CustomerProfilePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("cpid");

		return query.list();
	}

	@Override
	public CustomerProfilePO queryCustomerProfileByOrderId(String orderId) {
		return (CustomerProfilePO) session().createCriteria(CustomerProfilePO.class).add(Restrictions.eq(CustomerProfilePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
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

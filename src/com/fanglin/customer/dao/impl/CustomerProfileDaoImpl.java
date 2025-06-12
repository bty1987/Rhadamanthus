package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
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
	@SuppressWarnings("unchecked")
	public List<CustomerProfilePO> queryCustomerProfileByCsid(long csid, Short type) {

		Criteria query = session().createCriteria(CustomerProfilePO.class).add(Restrictions.eq("csid", csid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerProfilePO> queryCustomerProfileByCid(long cid, Short type) {

		Criteria query = session().createCriteria(CustomerProfilePO.class).add(Restrictions.eq("cid", cid));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerProfilePO> queryCustomerProfileByOrderId(String orderId, Short type) {

		Criteria query = session().createCriteria(CustomerProfilePO.class).add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.list();
	}

	@Override
	public int updateCustomerProfile(String orderId, long cid, long csid) {

		String sql = "update customer.customerprofile set orderId = :orderId, cid = :cid where csid = :csid";

		session().createSQLQuery(sql).setString("orderId", orderId).setLong("cid", cid).setLong("csid", csid).executeUpdate();

		return 0;
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

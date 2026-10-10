package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerFunctionDao;
import com.fanglin.customer.po.CustomerFunctionPO;
import com.fanglin.utils.Paging;

@Repository("customerFunctionDao")
public class CustomerFunctionDaoImpl extends DaoImpl<CustomerFunctionPO> implements CustomerFunctionDao {

	public CustomerFunctionDaoImpl() {
		super(CustomerFunctionPO.class);
	}

	@Override
	public List<CustomerFunctionPO> pageCustomerFunction(Paging paging, List<Filter> filters) {
		PagingQuery<CustomerFunctionPO> query = pagingQuery(paging, CustomerFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("cfid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("key".equals(field)) {
				query.add(query.getCriterion("key", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", data, op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", data, op));
			}
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerFunctionPO> queryCustomerFunction(Short type) {

		Criteria criteria = session().createCriteria(CustomerFunctionPO.class).add(Restrictions.eq("status", CustomerFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerFunctionPO> queryCustomerFunctionByName(String name) {
		return session().createCriteria(CustomerFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public long countCustomerFunctionRightByCfid(long cfid) {
		return ((Number) session().createQuery("select count(*) from CustomerFunctionRightPO where customerFunction.cfid = :cfid").setParameter("cfid", cfid).uniqueResult()).longValue();
	}

}

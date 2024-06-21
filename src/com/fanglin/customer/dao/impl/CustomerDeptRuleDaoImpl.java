package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerDeptRuleDao;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.utils.Paging;

@Repository("customerDeptRuleDao")
public class CustomerDeptRuleDaoImpl extends DaoImpl<CustomerDeptRulePO> implements CustomerDeptRuleDao {

	public CustomerDeptRuleDaoImpl() {
		super(CustomerDeptRulePO.class);
	}

	@Override
	public List<CustomerDeptRulePO> pageCustomerDeptRule(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<CustomerDeptRulePO> query = pagingQuery(paging, CustomerDeptRulePO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public CustomerDeptRulePO queryCustomerDeptRule(Integer did) {
		return (CustomerDeptRulePO) session().createCriteria(CustomerDeptRulePO.class).createAlias("department", "department").add(Restrictions.eq("department.did", did)).setMaxResults(1).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerDeptRulePO> queryCustomerDeptRule(Integer did, Short type) {

		Criteria criteria = session().createCriteria(CustomerDeptRulePO.class).add(Restrictions.eq("did", did));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(CustomerDeptRulePO.COLUMN_NAME_STR, data, op));
			} else if ("cusType".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("cusAtttype".equals(field)) {
				query.add(query.getCriterion("atttype", Short.valueOf(data), op));
			}
		}
	}

}

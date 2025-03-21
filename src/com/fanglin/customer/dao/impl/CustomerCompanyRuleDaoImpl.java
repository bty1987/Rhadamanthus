package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.LogicalExpression;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCompanyRuleDao;
import com.fanglin.customer.po.CustomerCompanyRulePO;
import com.fanglin.utils.Paging;

@Repository("customerCompanyRuleDao")
public class CustomerCompanyRuleDaoImpl extends DaoImpl<CustomerCompanyRulePO> implements CustomerCompanyRuleDao {

	public CustomerCompanyRuleDaoImpl() {
		super(CustomerCompanyRulePO.class);
	}

	@Override
	public List<CustomerCompanyRulePO> pageCustomerCompanyRule(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<CustomerCompanyRulePO> query = pagingQuery(paging, CustomerCompanyRulePO.class);

		query.add(Restrictions.eq("companys", company));

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCompanyRulePO> queryCustomerCompanyRule(int company, Integer did, Integer val) {

		Criteria criteria = session().createCriteria(CustomerCompanyRulePO.class).createAlias("dept", "dept", CriteriaSpecification.LEFT_JOIN).add(Restrictions.eq("companys", company));

		LogicalExpression area = null;
		LogicalExpression dept = null;

		if (val != null) {
			area = Restrictions.and(Restrictions.eq("type", CustomerCompanyRulePO.TYPE_AREA_INT), Restrictions.and(Restrictions.ge("lowval", val), Restrictions.le("uppval", val)));
		}

		if (did != null) {
			dept = Restrictions.and(Restrictions.eq("type", CustomerCompanyRulePO.TYPE_DEPT_INT), Restrictions.eq("dept.did", did));
		}

		if (area != null && dept != null) criteria.add(Restrictions.or(area, dept));
		if (area != null && dept == null) criteria.add(area);
		if (area == null && dept != null) criteria.add(dept);

		return criteria.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("uppval".equals(field)) {
				query.add(query.getCriterion("uppval", Integer.valueOf(data), op));
			} else if ("lowval".equals(field)) {
				query.add(query.getCriterion("lowval", Integer.valueOf(data), op));
			}
		}
	}

}

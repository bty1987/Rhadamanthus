package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCompanyRuleDao;
import com.fanglin.customer.po.CustomerCompanyRulePO;
import com.fanglin.utils.Paging;

@Repository("customerCompanytRuleDao")
public class CustomerCompanyRuleDaoImpl extends DaoImpl<CustomerCompanyRulePO> implements CustomerCompanyRuleDao {

	@Override
	public List<CustomerCompanyRulePO> pageCustomerCompanyRule(Paging paging, List<Filter> filters, int company) throws FLException {
		PagingQuery<CustomerCompanyRulePO> query = pagingQuery(paging, CustomerCompanyRulePO.class);

		query.add(Restrictions.eq("companys", company));

		queryFilterExecute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<CustomerCompanyRulePO> queryCustomerCompanyRule(Integer cid, Integer uppval, Integer lowval, Short type) {

		Criteria criteria = session().createCriteria(CustomerCompanyRulePO.class).createAlias("company", "company").add(Restrictions.eq("company.cid", cid));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		if (uppval != null) {
			criteria.add(Restrictions.eq("uppval", uppval));
		}

		if (lowval != null) {
			criteria.add(Restrictions.eq("lowval", lowval));
		}

		return criteria.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("cusType".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("cusAtttype".equals(field)) {
				query.add(query.getCriterion("atttype", Short.valueOf(data), op));
			}
		}
	}

}

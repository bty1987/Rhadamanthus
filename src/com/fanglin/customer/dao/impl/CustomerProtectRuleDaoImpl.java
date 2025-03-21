package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerProtectRuleDao;
import com.fanglin.customer.po.CustomerDeptRulePO;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.Paging;

@Repository("customerProtectRuleDao")
public class CustomerProtectRuleDaoImpl extends DaoImpl<CustomerProtectRulePO> implements CustomerProtectRuleDao {

	public CustomerProtectRuleDaoImpl() {
		super(CustomerProtectRulePO.class);
	}

	@Override
	public List<CustomerProtectRulePO> pageCustomerProtectRule(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerProtectRulePO> query = pagingQuery(paging, CustomerProtectRulePO.class);

		query.add(Restrictions.eq(CustomerProtectRulePO.COLUMN_COMPANY_STR, company));

		queryFilterExecute(query, filters);

		return query.list();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerProtectRulePO> queryCustomerProtectRule(Short type, Integer uppval, Integer lowval, Integer days) {

		Criteria criteria = session().createCriteria(CustomerDeptRulePO.class);

		if (type != null) {
			criteria.add(Restrictions.eq(CustomerProtectRulePO.COLUMN_TYPE_STR, type));
		}

		if (uppval != null) {
			criteria.add(Restrictions.eq(CustomerProtectRulePO.COLUMN_UPPVAL_STR, uppval));
		}

		if (lowval != null) {
			criteria.add(Restrictions.eq(CustomerProtectRulePO.COLUMN_LOWVAL_STR, lowval));
		}

		if (days != null) {
			criteria.add(Restrictions.eq(CustomerProtectRulePO.COLUMN_DAYS_STR, days));
		}

		return criteria.list();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerProtectRulePO> queryCustomerProtectRule(Short type, Integer uppval, Integer lowval) {
		return session().createCriteria(CustomerProtectRulePO.class).add(Restrictions.eq(CustomerProtectRulePO.COLUMN_TYPE_STR, type)).add(Restrictions.or(Restrictions.between(CustomerProtectRulePO.COLUMN_UPPVAL_STR, uppval, lowval), Restrictions.between(CustomerProtectRulePO.COLUMN_LOWVAL_STR, uppval, lowval))).list();
	}

	@Override
	public CustomerProtectRulePO queryCustomerProtectRule(Short type, Long value) {
		return (CustomerProtectRulePO) session().createCriteria(CustomerProtectRulePO.class).add(Restrictions.eq(CustomerProtectRulePO.COLUMN_TYPE_STR, type)).add(Restrictions.le(CustomerProtectRulePO.COLUMN_UPPVAL_STR, value)).add(Restrictions.ge(CustomerProtectRulePO.COLUMN_LOWVAL_STR, value)).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (CustomerProtectRulePO.COLUMN_TITLE_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (CustomerProtectRulePO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (CustomerProtectRulePO.COLUMN_UPPVAL_STR.equals(field)) {
				query.add(query.getCriterion(field, Arith.mul(Integer.valueOf(data), 1000000), op));
			} else if (CustomerProtectRulePO.COLUMN_LOWVAL_STR.equals(field)) {
				query.add(query.getCriterion(field, Arith.mul(Integer.valueOf(data), 1000000), op));
			} else if (CustomerProtectRulePO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}

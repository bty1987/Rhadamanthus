package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityProperRuleDao;
import com.fanglin.customer.po.CustomerCityProperRulePO;
import com.fanglin.utils.Paging;

@Repository("customerCityProperRuleDao")
public class CustomerCityProperRuleDaoImpl extends DaoImpl<CustomerCityProperRulePO> implements CustomerCityProperRuleDao {

	public CustomerCityProperRuleDaoImpl() {
		super(CustomerCityProperRulePO.class);
	}

	@Override
	public List<CustomerCityProperRulePO> pageCustomerCityProperRule(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerCityProperRulePO> query = pagingQuery(paging, CustomerCityProperRulePO.class);

		query.add(Restrictions.eq("company", company));
		query.add(Restrictions.eq("status", CustomerCityProperRulePO.STATUS_ENABLE_INT));

		queryFilterExcute(query, filters);

		query.desc("priority");
		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityProperRulePO> queryCustomerCityProperRule(Integer cpid, int company) {

		return session().createCriteria(CustomerCityProperRulePO.class).createAlias("city", "city").add(Restrictions.eq("city.cpid", cpid)).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", CustomerCityProperRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityProperRulePO> queryCustomerCityProperRuleByType(Integer cpid, int company, short type) {

		return session().createCriteria(CustomerCityProperRulePO.class).createAlias("city", "city").add(Restrictions.eq("city.cpid", cpid)).add(Restrictions.eq("company", company)).add(Restrictions.eq("type", type)).add(Restrictions.eq("status", CustomerCityProperRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityProperRulePO> queryCustomerCityProperRule(int company) {

		return session().createCriteria(CustomerCityProperRulePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", CustomerCityProperRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	private void queryFilterExcute(PagingQuery<CustomerCityProperRulePO> query, List<Filter> filters) {
	}
}

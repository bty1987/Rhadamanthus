package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerCityRuleDao;
import com.fanglin.customer.po.CustomerCityRulePO;
import com.fanglin.utils.Paging;

@Repository("customerCityRuleDao")
public class CustomerCityRuleDaoImpl extends DaoImpl<CustomerCityRulePO> implements CustomerCityRuleDao {

	public CustomerCityRuleDaoImpl() {
		super(CustomerCityRulePO.class);
	}

	@Override
	public void pageCustomerCityRule(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerCityRulePO> query = pagingQuery(paging, CustomerCityRulePO.class);

		query.add(Restrictions.eq("company", company));
		query.add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT));

		queryFilterExcute(query, filters);

		query.desc("priority");
		query.desc("createTime");

		query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityRulePO> queryCustomerCityRule(Integer cityid, int company) {

		return session().createCriteria(CustomerCityRulePO.class).createAlias("city", "city").add(Restrictions.eq("city.cpid", cityid)).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityRulePO> queryCustomerCityRuleByType(Integer cityid, int company, short type) {

		return session().createCriteria(CustomerCityRulePO.class).createAlias("city", "city").add(Restrictions.eq("city.cpid", cityid)).add(Restrictions.eq("company", company)).add(Restrictions.eq("type", type)).add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerCityRulePO> queryCustomerCityRule(int company) {

		return session().createCriteria(CustomerCityRulePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", CustomerCityRulePO.STATUS_ENABLE_INT)).addOrder(org.hibernate.criterion.Order.desc("priority")).list();
	}

	private void queryFilterExcute(PagingQuery<CustomerCityRulePO> query, List<Filter> filters) {
	}
}

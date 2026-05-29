package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationNamingRulePO;
import com.fanglin.data.quotation.dao.QuotationNamingRuleDao;
import com.fanglin.utils.Paging;

@Repository("quotationNamingRuleDao")
public class QuotationNamingRuleDaoImpl extends DaoImpl<QuotationNamingRulePO> implements QuotationNamingRuleDao {

	public QuotationNamingRuleDaoImpl() {
		super(QuotationNamingRulePO.class);
	}

	@Override
	public List<QuotationNamingRulePO> pageQuotationNamingRule(Paging paging, List<Filter> filters) {

		PagingQuery<QuotationNamingRulePO> query = pagingQuery(paging, QuotationNamingRulePO.class);

		queryFilterExcute(query, filters);

		query.asc("sort");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationNamingRulePO> queryQuotationNamingRule(short type) {

		Criteria query = session().createCriteria(QuotationNamingRulePO.class)
			.add(Restrictions.eq("status", QuotationNamingRulePO.STATUS_ENABLE_SHORT));

		if (type >= 0) {
			query.add(Restrictions.eq("type", type));
		}

		query.addOrder(org.hibernate.criterion.Order.asc("sort"));

		return query.list();
	}

	@Override
	public QuotationNamingRulePO queryQuotationNamingRuleByName(String name, short type) {

		return (QuotationNamingRulePO) session().createCriteria(QuotationNamingRulePO.class)
			.add(Restrictions.eq("type", type))
			.add(Restrictions.eq("name", name))
			.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationNamingRulePO> queryQuotationNamingRuleByPinyin(String pinyin, Short type, Short status) {

		Criteria query = session().createCriteria(QuotationNamingRulePO.class);

		if (pinyin != null && pinyin.length() > 0) {
			query.add(Restrictions.like("pinyin", pinyin + "%"));
		}

		if (type != null && type >= 0) {
			query.add(Restrictions.eq("type", type));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		} else {
			query.add(Restrictions.eq("status", QuotationNamingRulePO.STATUS_ENABLE_SHORT));
		}

		query.addOrder(org.hibernate.criterion.Order.asc("sort"));
		query.setMaxResults(10);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if (field.equals("type")) {
				query.add(query.getCriterion("type", Short.parseShort(data), op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}

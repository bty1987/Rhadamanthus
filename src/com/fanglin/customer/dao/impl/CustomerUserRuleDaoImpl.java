package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerUserRuleDao;
import com.fanglin.customer.po.CustomerUserRulePO;
import com.fanglin.utils.Paging;

@Repository("customerUserRuleDao")
public class CustomerUserRuleDaoImpl extends DaoImpl<CustomerUserRulePO> implements CustomerUserRuleDao {

	public CustomerUserRuleDaoImpl() {
		super(CustomerUserRulePO.class);
	}

	@Override
	public List<CustomerUserRulePO> pageCustomerUserRule(Paging paging, List<Filter> filters, int company) {

		PagingQuery<CustomerUserRulePO> query = pagingQuery(paging, CustomerUserRulePO.class);

		query.add(Restrictions.eq(CustomerUserRulePO.COLUMN_COMPANY_STR, company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("user".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_USER_STR, data, op));
			} else if ("creater".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_CREATER_STR, data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges(CustomerUserRulePO.COLUMN_CREATETIME_STR, CustomerUserRulePO.COLUMN_CREATETIME_STR, data);
			} else if ("finishTime".equals(field)) {
				query.timeranges(CustomerUserRulePO.COLUMN_FINISHTIME_STR, CustomerUserRulePO.COLUMN_FINISHTIME_STR, data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("company".equals(field)) {
				query.add(query.getCriterion(CustomerUserRulePO.COLUMN_COMPANY_STR, Integer.valueOf(data), op));
			}
		}
	}

}

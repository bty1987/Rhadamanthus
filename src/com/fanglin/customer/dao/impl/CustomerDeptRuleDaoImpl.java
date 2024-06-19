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
import com.fanglin.customer.vo.CustomerDeptRuleVO;
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

		query.desc("cdrid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerDeptRulePO> queryCustomerDeptRule(CustomerDeptRuleVO customerDeptRuleVO) {

		Criteria criteria = session().createCriteria(CustomerDeptRulePO.class).add(Restrictions.eq("did", customerDeptRuleVO.getDid()));

		criteria.add(Restrictions.eq("type", customerDeptRuleVO.getType()));

		return criteria.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			}
		}
	}

}

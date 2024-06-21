package com.fanglin.customer.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.po.CustomerChancePO;
import com.fanglin.utils.Paging;

@Repository("customerChanceDao")
public class CustomerChanceDaoImpl extends DaoImpl<CustomerChancePO> implements CustomerChanceDao {

	public CustomerChanceDaoImpl() {
		super(CustomerChancePO.class);
	}

	@Override
	public List<CustomerChancePO> pageCustomerChance(Paging paging, List<Filter> filters) {

		PagingQuery<CustomerChancePO> query = pagingQuery(paging, CustomerChancePO.class);

		queryFilterExcute(query, filters);

		query.desc("ccid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}
}

/**
 * @File Name	: CustomerServiceBackVisityDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.CustomerServiceBackVisitDao;
import com.fanglin.construction.po.CustomerServiceBackVisitPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerServiceBackVisitDao")
public class CustomerServiceBackVisityDaoImpl extends DaoImpl<CustomerServiceBackVisitPO> implements CustomerServiceBackVisitDao {

	public CustomerServiceBackVisityDaoImpl() {
		super(CustomerServiceBackVisitPO.class);
	}

	@Override
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisit(Paging paging, List<Filter> filters) {

		PagingQuery<CustomerServiceBackVisitPO> query = pagingQuery(paging, CustomerServiceBackVisitPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<CustomerServiceBackVisitPO> pageCustomerServiceBackVisitByOrderId(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<CustomerServiceBackVisitPO> query = pagingQuery(paging, CustomerServiceBackVisitPO.class);

		query.add(query.getCriterion(CustomerServiceBackVisitPO.COLUMN_ORDERID_STR, orderId, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.add(query.getCriterion(field, data, op));
		}

	}

}

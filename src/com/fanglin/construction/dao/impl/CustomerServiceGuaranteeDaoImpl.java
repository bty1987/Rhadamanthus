/**
 * @File Name	: CustomerServiceGuaranteeDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.CustomerServiceGuaranteeDao;
import com.fanglin.construction.po.CustomerServiceGuaranteePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerServiceGuaranteeDao")
public class CustomerServiceGuaranteeDaoImpl extends DaoImpl<CustomerServiceGuaranteePO> implements CustomerServiceGuaranteeDao {

	public CustomerServiceGuaranteeDaoImpl() {
		super(CustomerServiceGuaranteePO.class);
	}

	@Override
	public List<CustomerServiceGuaranteePO> pageCustomerServiceGuarantee(Paging paging, List<Filter> filters) {

		PagingQuery<CustomerServiceGuaranteePO> query = pagingQuery(paging, CustomerServiceGuaranteePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<CustomerServiceGuaranteePO> pageCustomerServiceGuaranteeByOrderId(Paging paging, List<Filter> filters, String orderId) {

		PagingQuery<CustomerServiceGuaranteePO> query = pagingQuery(paging, CustomerServiceGuaranteePO.class);

		query.add(query.getCriterion(CustomerServiceGuaranteePO.COLUMN_ORDERID_STR, orderId, "eq"));

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

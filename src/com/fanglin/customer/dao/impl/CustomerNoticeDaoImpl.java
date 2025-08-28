package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerNoticeDao;
import com.fanglin.customer.po.CustomerNoticePO;
import com.fanglin.utils.Paging;

@Repository("customerNoticeDao")
public class CustomerNoticeDaoImpl extends DaoImpl<CustomerNoticePO> implements CustomerNoticeDao {

	@Override
	public List<CustomerNoticePO> pageCustomerNotice(Paging paging, List<Filter> filters, String orderId, Short type) {

		PagingQuery<CustomerNoticePO> query = pagingQuery(paging, CustomerNoticePO.class);

		query.add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		queryFilterExcute(query, filters);

		query.desc("cnid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("type".equals(field)) {
				query.timeranges("type", data, op);
			}

		}
	}

}

package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.utils.Paging;

@Repository("customerSourceRecordDao")
public class CustomerSourceRecordDaoImpl extends DaoImpl<CustomerSourceRecordPO> implements CustomerSourceRecordDao{

	public CustomerSourceRecordDaoImpl() {
		super(CustomerSourceRecordPO.class);
	}

	@Override
	public List<CustomerSourceRecordPO> pageCustomerSourceRecord(Paging paging, List<Filter> filters, Long csid){

		PagingQuery<CustomerSourceRecordPO> query = pagingQuery(paging, CustomerSourceRecordPO.class);
		
		if (csid != null) {
			query.add(Restrictions.eq("csid", csid));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerSourceRecordPO> queryCustomerSourceRecord(long csid) {
		return session().createCriteria(CustomerSourceRecordPO.class).add(Restrictions.eq("csid", csid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("csrid".equals(field)) {
				query.add(query.getCriterion("csrid", data, op));
			}
		}
	}
}

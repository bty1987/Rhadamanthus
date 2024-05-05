package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerRecordDao;
import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerRecordDao")
public class CustomerRecordDaoImpl extends DaoImpl<CustomerRecordPO> implements CustomerRecordDao {

	public CustomerRecordDaoImpl() {
		super(CustomerRecordPO.class);
	}

	@Override
	public List<CustomerRecordPO> pageCustomerRecord(Paging paging, List<Filter> filters, Long cid) {

		PagingQuery<CustomerRecordPO> query = pagingQuery(paging, CustomerRecordPO.class);

		queryFilterExcute(query, filters);

		if (cid != null) {
			query.add(Restrictions.eq("cid", cid));
		}

		return query.list();

	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomerRecordPO> queryCustomerRecord(long cid) {
		return session().createCriteria(CustomerRecordPO.class).add(Restrictions.eq("cid", cid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

	}

}

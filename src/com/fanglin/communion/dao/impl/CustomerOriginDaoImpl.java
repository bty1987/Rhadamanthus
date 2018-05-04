package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Hibernate;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.CustomerOriginDao;
import com.fanglin.communion.po.CustomerOriginPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("customerOriginDao")
public class CustomerOriginDaoImpl extends DaoImpl<CustomerOriginPO> implements
		CustomerOriginDao {

	public CustomerOriginDaoImpl() {
		super(CustomerOriginPO.class);
	}

	@Override
	@SuppressWarnings("deprecation")
	public List<CustomerOriginPO> pageCustomerOrigin(Paging paging, List<Filter> filters, List<Integer> dids) {

		PagingQuery<CustomerOriginPO> query = pagingQuery(paging, CustomerOriginPO.class);

		if (dids != null && dids.size() > 0) {
			query.alias("department", "department");
			query.add(query.getCriterion("department.did", dids, "in"));

		}

		if (filters != null) {
			for (Filter filter : filters) {
				if ("customerSourcePhone".equals(filter.getField())) {
					query.add(query.getCriterion("phone", filter.getData(),filter.getOp()));
				} else if ("belonger".equals(filter.getField())) {
					query.alias("belonger", "belonger");
					query.add(query.getCriterion("belonger.userId", filter.getData(), filter.getOp()));
				} else if ("belonger.uid".equals(filter.getField())) {
					query.add(Restrictions.sqlRestriction("buid is ? ", null, Hibernate.STRING));
				}
			}
		}

		query.desc("csid");

		return query.list();
	}

}

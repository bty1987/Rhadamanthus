package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.AepairDao;
import com.fanglin.customer.po.AepairPO;
import com.fanglin.utils.Paging;

@Repository("aepairDao")
public class AepairDaoImpl extends DaoImpl<AepairPO> implements AepairDao {

	public AepairDaoImpl() {
		super(AepairPO.class);
	}

	@Override
	public List<AepairPO> pageAepair(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AepairPO> query = pagingQuery(paging, AepairPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AepairPO> queryAepair(long csid) {
		return session().createCriteria(AepairPO.class).add(Restrictions.eq("csid", csid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AepairPO> queryAepairByOrderId(String orderId) {
		return session().createCriteria(AepairPO.class).add(Restrictions.eq(AepairPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	private void queryFilterExcute(PagingQuery<AepairPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion(AepairPO.COLUMN_CREATER_USERID_STR, data, op));
			} else if ("updater".equals(field)) {
				query.alias("updater", "updater");
				query.add(query.getCriterion(AepairPO.COLUMN_UPDATE_USERID_STR, data, op));
			} else if (AepairPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(AepairPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			}
		}
	}

}

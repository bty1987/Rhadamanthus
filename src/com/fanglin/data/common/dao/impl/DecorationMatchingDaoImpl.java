package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationMatchingDao;
import com.fanglin.data.po.DecorationMatchingPO;
import com.fanglin.utils.Paging;

@Repository("decorationMatchingDao")
public class DecorationMatchingDaoImpl extends DaoImpl<DecorationMatchingPO> implements DecorationMatchingDao {

	public DecorationMatchingDaoImpl() {
		super(DecorationMatchingPO.class);
	}

	@Override
	public List<DecorationMatchingPO> pageDecorationMatching(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationMatchingPO> query = pagingQuery(paging, DecorationMatchingPO.class);

		query.add(Restrictions.eq(DecorationMatchingPO.COLUMN_COMPANY_STR, company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMatchingPO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company) {

		Criteria query = session().createCriteria(DecorationMatchingPO.class);

		if (type != null && type.size() > 0) {
			query.add(Restrictions.in(DecorationMatchingPO.COLUMN_TYPE_STR, type));
		}

		if (typeness != null && typeness.size() > 0) {
			query.add(Restrictions.in(DecorationMatchingPO.COLUMN_TYPENESS_STR, typeness));
		}

		query.add(Restrictions.eq(DecorationMatchingPO.COLUMN_COMPANY_STR, company));

		query.addOrder(Order.asc("dmid"));

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(Restrictions.ilike("name", data, MatchMode.ANYWHERE));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			} else if ("typeness".equals(field)) {
				query.add(query.getCriterion("typeness", Short.valueOf(data), op));
			} else if ("isShow".equals(field)) {
				query.add(query.getCriterion("isShow", Short.valueOf(data), op));
			}
		}
	}
}

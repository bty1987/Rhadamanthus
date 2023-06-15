package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DecorationBusitypeDao;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.utils.Paging;

@Repository("decorationBusitypeDao")
public class DecorationBusitypeDaoImpl extends DaoImpl<DecorationBusitypePO> implements DecorationBusitypeDao {

	public DecorationBusitypeDaoImpl() {
		super(DecorationBusitypePO.class);
	}

	@Override
	public List<DecorationBusitypePO> pageDecorationBusitype(Paging paging, List<Filter> filters, int company) {

		PagingQuery<DecorationBusitypePO> query = pagingQuery(paging, DecorationBusitypePO.class);

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq("company", company));

		query.asc("dbid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBusitypePO> queryDecorationBusitype(int company) {
		return session().createCriteria(DecorationBusitypePO.class).add(Restrictions.eq("company", company)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(Restrictions.ilike("name", data, MatchMode.ANYWHERE));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}
}

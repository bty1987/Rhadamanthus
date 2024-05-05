package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.utils.Paging;

@Repository("noodsDao")
public class NoodsDaoImpl extends DaoImpl<NoodsPO> implements NoodsDao {

	public NoodsDaoImpl() {
		super(NoodsPO.class);
	}

	@Override
	public List<NoodsPO> pageNoods(Paging paging, List<Filter> filters, int company) {

		PagingQuery<NoodsPO> query = pagingQuery(paging, NoodsPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NoodsPO> queryNoodsByName(String name, int limit, int company) {
		return session().createCriteria(NoodsPO.class).add(Restrictions.eq(NoodsPO.COLUMN_STATUS_STR, NoodsPO.STATUS_ENABLE_INT)).add(Restrictions.eq(NoodsPO.COLUMN_COMPANY_STR, company)).add(Restrictions.ilike(NoodsPO.COLUMN_NAME_STR, name, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	private void queryFilterExcute(PagingQuery<NoodsPO> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("nid".equals(field)) {
				query.add(query.getCriterion("nid", data, op));
			} else if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}

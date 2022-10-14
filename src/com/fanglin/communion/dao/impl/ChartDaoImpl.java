package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ChartDao;
import com.fanglin.communion.po.ChartPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("chartDao")
public class ChartDaoImpl extends DaoImpl<ChartPO> implements ChartDao {

	public ChartDaoImpl() {
		super(ChartPO.class);
	}

	@Override
	public List<ChartPO> pageChart(Paging paging, List<Filter> filters) {

		PagingQuery<ChartPO> query = pagingQuery(paging, ChartPO.class);

		queryFilterExcute(query, filters);

		query.desc("sort");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChartPO> queryChart(Short type, Short level) {

		Criteria query = session().createCriteria(ChartPO.class);

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		if (level != null) {
			query.add(Restrictions.eq("level", level));
		}

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("no")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("type")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (field.equals("level")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}

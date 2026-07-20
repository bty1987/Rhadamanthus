package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionCostDao;
import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionCostDao")
public class ConstructionCostDaoImpl extends DaoImpl<ConstructionCostPO> implements ConstructionCostDao {

	public ConstructionCostDaoImpl() {
		super(ConstructionCostPO.class);
	}

	@Override
	public List<ConstructionCostPO> pageConstructionCost(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionCostPO> query = pagingQuery(paging, ConstructionCostPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.asc("sort");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionCostPO> queryConstructionCost(int company) {
		return session().createCriteria(ConstructionCostPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ConstructionCostPO.COLUMN_STATUS_STR, ConstructionCostPO.STATUS_INIT_SHORT)).list();
	}

	@Override
	public ConstructionCostPO queryConstructionCost(int area, int company) {
		return (ConstructionCostPO) session().createCriteria(ConstructionCostPO.class).add(Restrictions.eq("company", company)).add(Restrictions.lt("areaLeft", area)).add(Restrictions.ge("areaRight", area)).add(Restrictions.eq("status", ConstructionCostPO.STATUS_INIT_SHORT)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String op = filter.getOp();
			String data = filter.getData();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}

}

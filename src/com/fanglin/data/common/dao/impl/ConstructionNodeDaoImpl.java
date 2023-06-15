package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.Paging;

@Repository("constructionNodeDao")
public class ConstructionNodeDaoImpl extends DaoImpl<ConstructionNodePO> implements ConstructionNodeDao {

	public ConstructionNodeDaoImpl() {
		super(ConstructionNodePO.class);
	}

	@Override
	public List<ConstructionNodePO> pageConstructionNode(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionNodePO> query = pagingQuery(paging, ConstructionNodePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		query.asc("sort");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionNodePO> queryConstructionNode(int company) {
		return session().createCriteria(ConstructionNodePO.class).add(Restrictions.eq("company", company)).addOrder(Order.asc(ConstructionNodePO.COLUMN_SORT_STR)).add(Restrictions.eq(ConstructionNodePO.COLUMN_STATUS_STR, ConstructionNodePO.STATUS_INIT_SHORT)).list();
	}

	@Override
	public ConstructionNodePO queryConstructionNodeBySort(short sort, int company) {
		return (ConstructionNodePO) session().createCriteria(ConstructionNodePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ConstructionNodePO.COLUMN_SORT_STR, sort)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String op = filter.getOp();
			String data = filter.getData();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if ("status".equals(filter.getField())) {
				query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
			}
		}
	}

}
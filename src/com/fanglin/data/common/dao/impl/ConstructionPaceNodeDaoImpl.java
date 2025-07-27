package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPaceNodeDao;
import com.fanglin.data.po.ConstructionPaceNodePO;
import com.fanglin.utils.Paging;

@Repository("constructionPaceNodeDao")
public class ConstructionPaceNodeDaoImpl extends DaoImpl<ConstructionPaceNodePO> implements ConstructionPaceNodeDao {

	public ConstructionPaceNodeDaoImpl() {
		super(ConstructionPaceNodePO.class);
	}

	@Override
	public List<ConstructionPaceNodePO> pageConstructionPaceNode(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionPaceNodePO> query = pagingQuery(paging, ConstructionPaceNodePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionPaceNodePO> queryConstructionPaceNode(long cpid) {
		return session().createCriteria(ConstructionPaceNodePO.class).add(Restrictions.eq("cpid", cpid)).add(Restrictions.eq("status", ConstructionPaceNodePO.STATUS_ENABLE_INT)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(ConstructionPaceNodePO.COLUMN_NAME_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(ConstructionPaceNodePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			}
		}
	}
}

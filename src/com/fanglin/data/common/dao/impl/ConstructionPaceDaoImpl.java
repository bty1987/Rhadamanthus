package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPaceDao;
import com.fanglin.data.po.ConstructionPacePO;
import com.fanglin.utils.Paging;

@Repository("constructionPaceDao")
public class ConstructionPaceDaoImpl extends DaoImpl<ConstructionPacePO> implements ConstructionPaceDao {

	public ConstructionPaceDaoImpl() {
		super(ConstructionPacePO.class);
	}

	@Override
	public List<ConstructionPacePO> pageConstructionPace(Paging paging, List<Filter> filters) {

		PagingQuery<ConstructionPacePO> query = pagingQuery(paging, ConstructionPacePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionPacePO> queryConstructionPace() {
		return session().createCriteria(ConstructionPacePO.class).add(Restrictions.eq("status", ConstructionPacePO.STATUS_ENABLE_INT)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion(ConstructionPacePO.COLUMN_NAME_STR, data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(ConstructionPacePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
			}
		}
	}
}

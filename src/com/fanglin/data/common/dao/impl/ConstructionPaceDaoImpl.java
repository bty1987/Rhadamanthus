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
	public List<ConstructionPacePO> pageConstructionPace(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionPacePO> query = pagingQuery(paging, ConstructionPacePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	public ConstructionPacePO queryConstructionPace(int area, int company) {
		return (ConstructionPacePO) session().createCriteria(ConstructionPacePO.class).add(Restrictions.gt("lowerArea", area)).add(Restrictions.lt("upperArea", area)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	private static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();

			if (ConstructionPacePO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(ConstructionPacePO.COLUMN_NAME_STR, String.valueOf(filter.getData()), filter.getOp()));
			}
		}
	}

}

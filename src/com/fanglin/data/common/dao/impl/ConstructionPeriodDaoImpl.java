package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionPeriodDao;
import com.fanglin.data.po.ConstructionPeriodPO;
import com.fanglin.utils.Paging;

@Repository("constructionPeriodDao")
public class ConstructionPeriodDaoImpl extends DaoImpl<ConstructionPeriodPO> implements ConstructionPeriodDao {

	public ConstructionPeriodDaoImpl() {
		super(ConstructionPeriodPO.class);
	}

	@Override
	public List<ConstructionPeriodPO> pageConstructionPeriod(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionPeriodPO> query = pagingQuery(paging, ConstructionPeriodPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	public ConstructionPeriodPO queryConstructionPeriod(int area, int company) {
		return (ConstructionPeriodPO) session().createCriteria(ConstructionPeriodPO.class).add(Restrictions.gt("lowerArea", area)).add(Restrictions.lt("upperArea", area)).add(Restrictions.eq("company", company)).setMaxResults(1).uniqueResult();
	}

	private static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();

			if (ConstructionPeriodPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(ConstructionPeriodPO.COLUMN_NAME_STR, String.valueOf(filter.getData()), filter.getOp()));
			}
		}
	}

}

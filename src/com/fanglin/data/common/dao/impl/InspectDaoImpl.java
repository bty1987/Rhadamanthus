package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.InspectDao;
import com.fanglin.data.po.InspectPO;
import com.fanglin.utils.Paging;

@Repository("inspectDao")
public class InspectDaoImpl extends DaoImpl<InspectPO> implements InspectDao {

	public InspectDaoImpl() {
		super(InspectPO.class);
	}

	@Override
	public List<InspectPO> pageInspect(Paging paging, List<Filter> filters) {

		PagingQuery<InspectPO> query = pagingQuery(paging, InspectPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<InspectPO> queryInspect(Short atttype, Short type) {

		Criteria criteria = session().createCriteria(InspectPO.class);

		if (atttype != null) criteria.add(Restrictions.eq(InspectPO.COLUMN_ATTTYPE_STR, atttype));

		if (type != null) criteria.add(Restrictions.eq(InspectPO.COLUMN_TYPE_STR, type));

		return criteria.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (InspectPO.COLUMN_NAME_STR.equals(field)) {
				query.add(query.getCriterion(field, data, op));
			} else if (InspectPO.COLUMN_ATTTYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (InspectPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (InspectPO.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}

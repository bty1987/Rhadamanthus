package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.InspectItemDao;
import com.fanglin.data.po.InspectItemPO;
import com.fanglin.utils.Paging;

@Repository("inspectItemDao")
public class InspectItemDaoImpl extends DaoImpl<InspectItemPO> implements InspectItemDao {

	public InspectItemDaoImpl() {
		super(InspectItemPO.class);
	}

	@Override
	public List<InspectItemPO> pageInspectItem(Paging paging, List<Filter> filters) {

		PagingQuery<InspectItemPO> query = pagingQuery(paging, InspectItemPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<InspectItemPO> queryInspectItem(Long iid) {
		return session().createCriteria(InspectItemPO.class).add(Restrictions.eq(InspectItemPO.COLUMN_IID_STR, iid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (InspectItemPO.COLUMN_TYPE_STR.equals(field)) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}

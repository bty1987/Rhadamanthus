package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormoodPO;
import com.fanglin.data.quotation.dao.CormoodDao;
import com.fanglin.utils.Paging;
import com.fanglin.utils.PagingQuery;

@Repository("cormoodDao")
public class CormoodDaoImpl extends DaoImpl<CormoodPO> implements CormoodDao {

	public CormoodDaoImpl() {
		super(CormoodPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CormoodPO> pageCormood(Paging paging, List<Filter> filters) {
		PagingQuery<CormoodPO> query = pagingQuery(paging, CormoodPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CormoodPO> queryCormoodByQfid(Long qfid) {
		return createCriteria(CormoodPO.class).add(Restrictions.eq(CormoodPO.COLUMN_QFID_STR, qfid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("qfid".equals(field)) {
				query.add(query.getCriterion("qfid", data, op));
			}
		}
	}

}

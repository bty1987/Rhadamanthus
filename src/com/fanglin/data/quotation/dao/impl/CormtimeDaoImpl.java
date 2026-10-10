package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormtimePO;
import com.fanglin.data.quotation.dao.CormtimeDao;
import com.fanglin.utils.Paging;

@Repository("cormtimeDao")
public class CormtimeDaoImpl extends DaoImpl<CormtimePO> implements CormtimeDao {

	public CormtimeDaoImpl() {
		super(CormtimePO.class);
	}

	@Override
	public List<CormtimePO> pageCormtime(Paging paging, List<Filter> filters) {
		PagingQuery<CormtimePO> query = pagingQuery(paging, CormtimePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CormtimePO> queryCormtimeByQfid(Long qfid) {
		return createCriteria(CormtimePO.class).add(Restrictions.eq(CormtimePO.COLUMN_QFID_STR, qfid)).list();
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

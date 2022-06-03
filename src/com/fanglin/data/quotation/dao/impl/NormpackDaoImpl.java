package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormpackPO;
import com.fanglin.data.quotation.dao.NormpackDao;
import com.fanglin.utils.Paging;

@Repository("normpackDao")
public class NormpackDaoImpl extends DaoImpl<NormpackPO> implements NormpackDao {

	public NormpackDaoImpl() {
		super(NormpackPO.class);
	}

	@Override
	public List<NormpackPO> pageNormpack(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<NormpackPO> query = pagingQuery(paging, NormpackPO.class);

		if (company != null) {
			query.add(Restrictions.eq("company", company));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormpackPO> queryNormpack(int company) {
		return session().createCriteria(NormpackPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", NormpackPO.STATUS_START_SHORT)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}

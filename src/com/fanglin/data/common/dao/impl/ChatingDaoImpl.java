package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ChatingDao;
import com.fanglin.data.po.ChatingPO;
import com.fanglin.data.po.ContractPO;
import com.fanglin.utils.Paging;

@Repository("chatingDao")
public class ChatingDaoImpl extends DaoImpl<ChatingPO> implements ChatingDao {

	public ChatingDaoImpl() {
		super(ChatingPO.class);
	}

	@Override
	public List<ChatingPO> pageChating(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ChatingPO> query = pagingQuery(paging, ChatingPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("cid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ChatingPO> queryChating(int company) {

		return session().createCriteria(ChatingPO.class).add(Restrictions.eq(ContractPO.COLUMN_COMPANY_STR, company)).add(Restrictions.eq(ChatingPO.COLUMN_STATUS_STR, ChatingPO.STATUS_START_INT)).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
			}
		}

	}

}

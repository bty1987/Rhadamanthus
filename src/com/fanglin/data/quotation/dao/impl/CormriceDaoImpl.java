package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.CormricePO;
import com.fanglin.data.quotation.dao.CormriceDao;
import com.fanglin.utils.Paging;

@Repository("cormriceDao")
public class CormriceDaoImpl extends DaoImpl<CormricePO> implements CormriceDao {

	public CormriceDaoImpl() {
		super(CormricePO.class);
	}

	@Override
	public List<CormricePO> pageCormrice(Paging paging, List<Filter> filters, Integer company) {
		PagingQuery<CormricePO> query = pagingQuery(paging, CormricePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CormricePO> queryCormriceByQcid(Long qcid) {
		return createCriteria(CormricePO.class).createAlias("quotationCtem", "quotationCtem").add(Restrictions.eq(CormricePO.COLUMN_QCID_STR, qcid)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("qcid".equals(field)) {
				query.add(query.getCriterion("qcid", data, op));
			}
		}
	}

}

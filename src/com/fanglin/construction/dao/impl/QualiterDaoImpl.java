package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.QualiterDao;
import com.fanglin.construction.po.QualiterPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.impl.DecorationDaoImpl;
import com.fanglin.utils.Paging;

@Repository("qualiterDao")
public class QualiterDaoImpl extends DaoImpl<QualiterPO> implements QualiterDao {

	public QualiterDaoImpl() {
		super(QualiterPO.class);
	}

	@Override
	public List<QualiterPO> pageConstructionForQualiter(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<QualiterPO> query = pagingQuery(paging, QualiterPO.class);

		queryFilterExcute(query, filters);

		query.desc("qid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QualiterPO> queryQualiter(String orderId) {

		return session().createCriteria(QualiterPO.class).add(Restrictions.eq(QualiterPO.COLUMN_ORDERID_STR, orderId)).list();

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

		query.alias("user", "user");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userId".equals(field)) {

				query.add(query.getCriterion("user.userId", data, op));
			}
		}

	}

}

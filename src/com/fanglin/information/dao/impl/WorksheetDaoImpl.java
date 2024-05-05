package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.WorksheetDao;
import com.fanglin.information.po.WorksheetPO;
import com.fanglin.utils.Paging;

@Repository("worksheetDao")
public class WorksheetDaoImpl extends DaoImpl<WorksheetPO> implements WorksheetDao {

	public WorksheetDaoImpl() {
		super(WorksheetPO.class);
	}

	@Override
	public List<WorksheetPO> pageWorksheet(Paging paging, List<Filter> filters, int company) {

		PagingQuery<WorksheetPO> query = pagingQuery(paging, WorksheetPO.class);

		queryFilterExecute(query, filters);

		query.asc("status").desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorksheetPO> queryWorksheet(String userId) {
		return session().createCriteria(WorksheetPO.class).createAlias("creater", "creater").add(Restrictions.eq(WorksheetPO.COLUMN_USERID_STR, userId)).add(Restrictions.or(Restrictions.eq("status", WorksheetPO.STATUS_INIT_INT), Restrictions.eq("status", WorksheetPO.STATUS_HANDL_INT))).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("creater".equals(field)) {
				query.alias("creater", "creater");
				query.add(query.getCriterion("creater.userId", data, op));
			} else if ("code".equals(field)) {
				query.add(query.getCriterion("code", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("handler".equals(field)) {
				query.alias("handler", "handler");
				query.add(query.getCriterion("handler.userId", data, op));
			}
		}
	}

}

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.AssistanceDao;
import com.fanglin.communion.po.AssistancePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("AssistanceDao")
public class AssistanceDaoImpl extends DaoImpl<AssistancePO> implements AssistanceDao {

	public AssistanceDaoImpl() {
		super(AssistancePO.class);
	}

	@Override
	public List<AssistancePO> pageAssistance(Paging paging, List<Filter> filters) {

		PagingQuery<AssistancePO> query = pagingQuery(paging, AssistancePO.class);

		queryFilterExecute(query, filters);

		query.desc("aid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AssistancePO> queryAssistance() {
		return session().createCriteria(AssistancePO.class).add(Restrictions.eq(AssistancePO.COLUMN_STATUS_INT, AssistancePO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public AssistancePO queryAssistance(Long aid, String keyword) {

		Criteria query = session().createCriteria(AssistancePO.class);

		if (aid != null) {
			query.add(Restrictions.eq("aid", aid));
		}

		if (keyword != null) {
			query.add(Restrictions.eq("keyword", keyword));
		}

		return (AssistancePO) query.setMaxResults(1).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			}
		}
	}

}

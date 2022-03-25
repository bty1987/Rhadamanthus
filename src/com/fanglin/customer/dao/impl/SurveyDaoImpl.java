package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.SurveyDao;
import com.fanglin.customer.po.SurveyPO;
import com.fanglin.utils.Paging;

@Repository("surveyDao")
public class SurveyDaoImpl extends DaoImpl<SurveyPO> implements SurveyDao {

	public SurveyDaoImpl() {
		super(SurveyPO.class);
	}

	@Override
	public List<SurveyPO> pageSurvey(Paging paging, List<Filter> filters) {
		PagingQuery<SurveyPO> query = pagingQuery(paging, SurveyPO.class);

		queryFilterExecute(query, filters);

		query.asc("sid");

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SurveyPO> querySurveyByOrderId(String orderId) {

		return session().createCriteria(SurveyPO.class).add(Restrictions.eq(SurveyPO.COLUMN_ORDERID_STR, orderId)).list();

	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			if ("orderId".equals(field)) {
				query.add(query.getCriterion("orderId", data, op));
			}
		}

	}

}

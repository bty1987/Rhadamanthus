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
	public List<SurveyPO> pageSurvey(Paging paging, List<Filter> filters, int company) {
		PagingQuery<SurveyPO> query = pagingQuery(paging, SurveyPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.desc("sid");

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
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", data);
			} else if ("sendTime".equals(field)) {
				query.timeranges("sendTime", data);
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.valueOf(data), op));
			} else if ("finishTime".equals(field)) {
				query.timeranges("finishTime", data);
			} else if ("handleTime".equals(field)) {
				query.timeranges("handleTime", data);
			}
		}

	}

}

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SurveyTemplateDao;
import com.fanglin.data.po.SurveyTemplatePO;
import com.fanglin.utils.Paging;

@Repository("surveyTemplateDao")
public class SurveyTemplateDaoImpl extends DaoImpl<SurveyTemplatePO> implements SurveyTemplateDao {

	public SurveyTemplateDaoImpl() {
		super(SurveyTemplatePO.class);
	}

	@Override
	public List<SurveyTemplatePO> pageSurveyTemplate(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SurveyTemplatePO> query = pagingQuery(paging, SurveyTemplatePO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExecute(query, filters);

		query.asc("stid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SurveyTemplatePO> querySurveyTemplate(int company) {
		return session().createCriteria(SurveyTemplatePO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("status", SurveyTemplatePO.STATUS_ENABLE_INT)).list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", filter));
			} else if ("status".equals(field)) {
				query.add(Restrictions.eq("status", Short.valueOf(data)));
			}

		}
	}

}

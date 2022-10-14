package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.ConstructionReportDao;
import com.fanglin.report.po.ConstructionReportPO;
import com.fanglin.utils.Paging;

@Repository("ConstructionReportDao")
public class ConstructionReportDaoImpl extends DaoImpl<ConstructionReportPO> implements ConstructionReportDao {

	public ConstructionReportDaoImpl() {
		super(ConstructionReportPO.class);
	}

	@Override
	public List<ConstructionReportPO> queryConstruction7Achievement(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ConstructionReportPO> query = pagingQuery(paging, ConstructionReportPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();

				if ("year".equals(field)) {
					query.add(Restrictions.eq("year", Integer.valueOf(data)));
				} else if ("month".equals(field)) {
					query.add(Restrictions.eq("month", Integer.valueOf(data)));
				}
			}
		}
	}

}
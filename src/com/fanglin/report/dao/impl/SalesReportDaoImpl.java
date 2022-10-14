package com.fanglin.report.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.SalesReportDao;
import com.fanglin.report.po.SalesAchievementsPO;
import com.fanglin.utils.Paging;

@Repository("SalesReportDao")
public class SalesReportDaoImpl extends DaoImpl<SalesAchievementsPO> implements SalesReportDao {

	public SalesReportDaoImpl() {
		super(SalesAchievementsPO.class);
	}

	@Override
	public List<SalesAchievementsPO> querySales7Achievement(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SalesAchievementsPO> query = pagingQuery(paging, SalesAchievementsPO.class);

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
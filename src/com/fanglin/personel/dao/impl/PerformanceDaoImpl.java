package com.fanglin.personel.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.PerformanceDao;
import com.fanglin.personel.po.PerformancePO;
import com.fanglin.utils.Paging;

@Repository("performanceDao")
public class PerformanceDaoImpl extends DaoImpl<PerformancePO> implements PerformanceDao {

	@Override
	public List<PerformancePO> pagePerformance(Paging paging, List<Filter> filters) {

		PagingQuery<PerformancePO> query = pagingQuery(paging, PerformancePO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userName".equals(field)) {
				query.alias("user", "user");
				query.add(query.getCriterion("user.userId", data, op));
			} else if (field.equals("type")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if ("performancestartTime".equals(field)) {
				query.timeranges("startTime", data);
			} else if ("performanceendTime".equals(field)) {
				query.timeranges("endTime", data);
			}
		}
	}

}

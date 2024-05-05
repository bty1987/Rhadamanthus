package com.fanglin.salary.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.SalaryDao;
import com.fanglin.salary.po.SalaryPO;
import com.fanglin.utils.Paging;

@Repository("salaryDao")
public class SalaryDaoImpl extends DaoImpl<SalaryPO> implements SalaryDao {

	public SalaryDaoImpl() {
		super(SalaryPO.class);
	}

	@Override
	public List<SalaryPO> pageSalary(Paging paging, List<Filter> filters) {

		PagingQuery<SalaryPO> query = pagingQuery(paging, SalaryPO.class);

		queryFilterExcuteForWorker(query, filters);

		return query.list();
	}

	private void queryFilterExcuteForWorker(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("user", "user");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userId".equals(field)) {
				query.add(query.getCriterion("user.userId", data, op));
			} else if ("userName".equals(field)) {
				query.add(query.getCriterion("user.userName", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion(SalaryPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if ("operateTime".equals(field)) {
				query.timeranges(SalaryPO.COLUMN_OPERATETIME_STR, data);
			} else if ("createTime".equals(field)) {
				query.timeranges(SalaryPO.COLUMN_CREATETIME_STR, data);
			}
		}
	}

}

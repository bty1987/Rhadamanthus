package com.fanglin.salary.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.SalaryDao;
import com.fanglin.salary.po.SalaryPO;
import com.fanglin.utils.DateUtil;
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

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userName".equals(filet)) {
				query.alias("user", "user");
				query.add(query.getCriterion("user.userId", data, op));
			}

			if ("status".equals(filet)) {
				query.add(query.getCriterion(SalaryPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			}

			if ("operateTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(SalaryPO.COLUMN_OPERATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(SalaryPO.COLUMN_OPERATETIME_STR, sTimestamp, "ge"));
			}
			if ("createTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(SalaryPO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(SalaryPO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
			}
		}
	}

}

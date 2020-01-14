package com.fanglin.salary.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("workerSalaryDao")
public class WorkerSalaryDaoImpl extends DaoImpl<WorkerSalaryPO> implements WorkerSalaryDao {

	public WorkerSalaryDaoImpl() {
		super(WorkerSalaryPO.class);
	}

	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<Filter> filters, int company) {

		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging, WorkerSalaryPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<Filter> filters) {

		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging, WorkerSalaryPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WorkerSalaryPO> queryWorkerSalary(String userId, Long csid) {
		return session().createCriteria(WorkerSalaryPO.class).createAlias("user", "user").add(Restrictions.eq(WorkerSalaryPO.COLUMN_USERID_STR, userId)).add(Restrictions.eq(WorkerSalaryPO.COLUMN_CSID_STR, csid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerSalaryPO> queryWorkerSalary(int wuid) {
		return session().createCriteria(WorkerSalaryPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid", wuid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerSalaryPO> queryWorkerSalaryByCwsid(Long wsid) {
		return session().createCriteria(WorkerSalaryPO.class).add(Restrictions.or(Restrictions.eq("wsId", wsid), Restrictions.eq("cwsid", wsid))).list();
	}

	public int countWorkerSalary(Long cid, Integer wuid) {

		String sql = "select count(*) from salary.workerSalary where cid = :cid and wuid = :wuid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid.longValue()).setInteger("wuid", wuid).uniqueResult();

		return count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("uid".equals(filet)) {
				query.alias("user", "user");
				query.add(Restrictions.eq("user.uid", Integer.valueOf(data)));
			} else if ("userId".equals(filet)) {
				query.alias("user", "user");
				query.add(Restrictions.eq("user.userId", data));
			} else if ("userName".equals(filet)) {
				query.alias("user", "user");
				query.add(query.getCriterion("user.userId", data, op));
			} else if ("orderId".equals(filet)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion("decoration.orderId", data, op));
			} else if ("schedule".equals(filet)) {
				query.add(Restrictions.eq("schedule", Short.valueOf(data)));
			} else if ("duty".equals(filet)) {
				query.alias("user", "user");
				query.alias("user.duty", "duty");
				query.add(query.getCriterion("duty.name", data, op));
			} else if ("status".equals(filet)) {
				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if ("startTime".equals(filet)) {
				query.add(Restrictions.ge("createTime", Timestamp.valueOf(data)));
			} else if ("endTime".equals(filet)) {
				query.add(Restrictions.le("createTime", Timestamp.valueOf(data)));
			} else if ("approveTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_APPROVETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_APPROVETIME_STR, sTimestamp, "ge"));
			} else if ("createTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
			}
		}
	}

}

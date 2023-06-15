package com.fanglin.salary.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
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
		return session().createCriteria(WorkerSalaryPO.class).add(Restrictions.or(Restrictions.eq("wsid", wsid), Restrictions.eq("cwsid", wsid))).list();
	}

	@Override
	public int countWorkerSalary(Long cid, Integer wuid) {

		String sql = "select count(*) from salary.workerSalary where cid = :cid and wuid = :wuid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid.longValue()).setInteger("wuid", wuid).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countWorkerSalary(String orderId, Long csid) {

		String sql = "select count(*) from salary.workerSalary where orderId = :orderId and csid = :csid and status in :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setLong("csid", csid).setParameterList("status", Arrays.asList(WorkerSalaryPO.STATUS_INIT_INT, WorkerSalaryPO.STATUS_PASS_INT)).uniqueResult();

		return count.intValue();
	}

	@Override
	public int updateWorkerSalary(String orderId, Long csid) {

		String sql = "update salary.workerSalary set count = count - 1 where orderId = :orderId and csid = :csid and status in :status and count > 1";
		session().createSQLQuery(sql).setString("orderId", orderId).setLong("csid", csid).setParameterList("status", Arrays.asList(WorkerSalaryPO.STATUS_INIT_INT, WorkerSalaryPO.STATUS_PASS_INT)).executeUpdate();

		return 0;
	}

	@Override
	public int updateWorkerSalary(Timestamp beginTime, Timestamp finishTime, int company) {

		String sql = "update salary.workerSalary set issend = 1 where approveTime > :beginTime and approveTime < :finishTime and company = :company and status = :status and issend = :issend";
		session().createSQLQuery(sql).setTimestamp("beginTime", beginTime).setTimestamp("finishTime", finishTime).setInteger("company", company).setShort("status", WorkerSalaryPO.STATUS_PASS_INT).setShort("issend", WorkerSalaryPO.ISSEND_UNSEND_INT).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

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
			} else if ("csid".equals(filet)) {
				query.add(Restrictions.eq("csid", Long.valueOf(data)));
			} else if ("schedule".equals(filet)) {
				query.add(Restrictions.eq("schedule", Short.valueOf(data)));
			} else if ("cnid".equals(filet)) {
				query.add(Restrictions.eq("cnid", Long.valueOf(data)));
			} else if ("duty".equals(filet)) {
				query.alias("user", "user");
				query.alias("user.duty", "duty");
				query.add(query.getCriterion("duty.name", data, op));
			} else if ("status".equals(filet)) {
				query.add(query.getCriterion(WorkerSalaryPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if ("count".equals(filet)) {
				query.add(query.getCriterion("count", Integer.valueOf(data), data.equals("1") ? "eq" : "ge"));
			} else if ("startTime".equals(filet)) {
				query.add(Restrictions.ge("createTime", Timestamp.valueOf(data)));
			} else if ("endTime".equals(filet)) {
				query.add(Restrictions.le("createTime", Timestamp.valueOf(data)));
			} else if ("approveTime".equals(filter.getField())) {
				query.timeranges(WorkerSalaryPO.COLUMN_APPROVETIME_STR, data);
			} else if ("createTime".equals(filter.getField())) {
				query.timeranges(WorkerSalaryPO.COLUMN_CREATETIME_STR, data);
			} else if ("checkTime".equals(filter.getField())) {
				query.timeranges(WorkerSalaryPO.COLUMN_CHECKTIME_STR, data);
			} else if ("checker".equals(filet)) {
				query.alias("checker", "checker");
				query.add(query.getCriterion("checker.userId", data, op));
			} else if ("isCheck".equals(filet)) {
				query.add(query.getCriterion("isCheck", Short.valueOf(data), op));
			} else if ("twotype".equals(filet)) {
				query.add(query.getCriterion("twotype", Short.valueOf(data), op));
			}
		}
	}
}

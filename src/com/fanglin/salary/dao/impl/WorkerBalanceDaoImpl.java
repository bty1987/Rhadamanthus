package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WorkerBalanceDao;
import com.fanglin.salary.po.WorkerBalancePO;
import com.fanglin.utils.Paging;

@Repository("workerBalanceDao")
public class WorkerBalanceDaoImpl extends DaoImpl<WorkerBalancePO> implements WorkerBalanceDao {

	public WorkerBalanceDaoImpl(){
		super(WorkerBalancePO.class);
	}
	
	@Override
	public List<WorkerBalancePO> pageWorkerBalance(Paging paging,List<Filter> filters, int company) {

		PagingQuery<WorkerBalancePO> query = pagingQuery(paging, WorkerBalancePO.class);
		
		query.add(Restrictions.eq("company", company));

		queryFilterExcuteForWorker(query, filters);

		return query.list();
	}
	
	@Override
	public WorkerBalancePO queryWorkerBalanceByUserId(int uid, int company) {
		
		return (WorkerBalancePO) session().createCriteria(WorkerBalancePO.class).createAlias("user", "user").add(Restrictions.eq(WorkerBalancePO.COLUMN_UID_STR, uid)).add(Restrictions.eq("company", company)).uniqueResult();
	}
	
	private void queryFilterExcuteForWorker(PagingQuery<?> query,List<Filter> filters) {
		if (filters != null) {
			for (Filter filter : filters) {

				String filet = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				if ("userName".equals(filet)) {
					query.alias("user", "user");
					query.add(query.getCriterion("user.userId", data, op));
				}

				if ("duty".equals(filet)) {
					query.alias("user", "user");
					query.alias("user.duty", "duty");
					query.add(query.getCriterion("duty.name", data, op));

				}
			}
		}
	}
}

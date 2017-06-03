package com.fanglin.salary.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;

@Repository("workerSalaryDao")
public class WorkerSalaryDaoImpl extends DaoImpl<WorkerSalaryPO> implements WorkerSalaryDao {
	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging,List<Filter> filters) {
		
		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging,WorkerSalaryPO.class);
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public WorkerSalaryPO queryWorkSalaryByWsId(Long wsId) {
		
		return (WorkerSalaryPO) session().createCriteria(WorkerSalaryPO.class).add(Restrictions.eq(WorkerSalaryPO.COLUMN_WSID_STR, wsId)).uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<WorkerSalaryPO> queryWorkerSalary(String userId, Long csId) {
		
		return session().createCriteria(WorkerSalaryPO.class).add(Restrictions.eq(WorkerSalaryPO.COLUMN_USER_USERID_STR,userId)).add(Restrictions.eq(WorkerSalaryPO.COLUMN_CSID_STR, csId)).list();
	}

	@Override
	public int countWorkerSalary(Long csId, String userId) {
		
		String sql = "select count(*) from platform.workerSalary where csId = :csId and userId = :userId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("csId", csId).setString("userId", userId).uniqueResult();
		
		return count.intValue();
	}

	@Override
	public void deleteWorkerSalary(Long wsid) {
		
		String sql = "delete from platform.workersalary where wsid = :wsid";
		session().createSQLQuery(sql).setLong("wsid", wsid).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				String filet = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				query.alias("user", "user");
				if (WorkerSalaryPO.ORDERID_STR.equals(filet)) {
					query.add(query.getCriterion(WorkerSalaryPO.ORDERID_STR,data, op));
				}  
				if ("userName".equals(filet)) {
					query.add(query.getCriterion(WorkerSalaryPO.COLUMN_USER_USERNAME, data, op));
				}
			}
		}
	}
	
	public WorkerSalaryDaoImpl() {
		super(WorkerSalaryPO.class);
	}
}

package com.fanglin.salary.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.DateUtil;
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
	public List<WorkerSalaryPO> queryWorkerSalary(String userId, Long cid) {
		
		return session().createCriteria(WorkerSalaryPO.class).add(Restrictions.eq(WorkerSalaryPO.COLUMN_USER_USERID_STR,userId)).add(Restrictions.eq(WorkerSalaryPO.COLUMN_CSID_STR, cid)).list();
	}


	
	@Override
	public int countWorkerSalary(Long cid, String userId) {
		
		String sql = "select count(*) from platform.workerSalary where cid = :cid and userId = :userId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setString("userId", userId).uniqueResult();
		
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
				String data =filter.getData();
				String op = filter.getOp();
				
				if ("userName".equals(filet)) {
						query.alias("user", "user");
						query.add(query.getCriterion("user.userName", data, op));
				}
				
				if ("orderId".equals(filet)) {
					query.alias("decorationOrder", "decorationOrder");
					query.add(query.getCriterion("decorationOrder.orderId", data, op));
				} 
				
				
				if ("duty".equals(filet)) {
					query.alias("user", "user");
					query.add(query.getCriterion(WorkerSalaryPO.COLUMN_USER_USERDUTY, data, op));
				}
				
				if("status".equals(filet)){
					query.add(query.getCriterion(WorkerSalaryPO.STATUS_INIT_STRA, Short.parseShort(data), op));
				}
				
				
				 if("approveTime".equals(filter.getField())){
					
					
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion(WorkerSalaryPO.COLUMN_APPROVETIME, eTimestamp, "le"));
					query.add(query.getCriterion(WorkerSalaryPO.COLUMN_APPROVETIME, sTimestamp, "ge"));
				}
				 if("createTime".equals(filter.getField())){
						
						String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion(WorkerSalaryPO.COLUMN_CREATETIME, eTimestamp, "le"));
						query.add(query.getCriterion(WorkerSalaryPO.COLUMN_CREATETIME, sTimestamp, "ge"));
					}
			
			}
		}
	}
	
	public WorkerSalaryDaoImpl() {
		super(WorkerSalaryPO.class);
	}

	
}

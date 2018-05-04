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
	
	public WorkerSalaryDaoImpl() {
		super(WorkerSalaryPO.class);
	}
	
	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging,List<Filter> filters,int company) {
		
		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging,WorkerSalaryPO.class);
		
		query.add(Restrictions.eq("company", company));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	public List<WorkerSalaryPO> pageSalaryWorkerForUser(Paging paging,List<Filter> filters) {
		
		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging,WorkerSalaryPO.class);
		
		queryFilterExcuteForWorker(query, filters);
		
		return query.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<WorkerSalaryPO> queryWorkerSalary(String userId, Long cid) {
		
		return session().createCriteria(WorkerSalaryPO.class).createAlias("user", "user").add(Restrictions.eq(WorkerSalaryPO.COLUMN_USER_USERID_STR,userId)).add(Restrictions.eq(WorkerSalaryPO.COLUMN_CSID_STR, cid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerSalaryPO> queryWorkerSalaryByuid(int wuid) {
		
		return session().createCriteria(WorkerSalaryPO.class).createAlias("user", "user").add(Restrictions.eq("user.uid",wuid)).list();
	}
	
	public int countWorkerSalary(Long cid, Integer wuid){
		
	    String sql = "select count(*) from salary.workerSalary where cid = :cid and wuid = :wuid";
	    BigInteger count = (BigInteger)session().createSQLQuery(sql).setLong("cid", cid.longValue()).setInteger("wuid", wuid).uniqueResult();
	    
	    return count.intValue();
	  }
		
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				
				String filet = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				 if ("userName".equals(filet)) {
						query.alias("user", "user");
						query.add(query.getCriterion("user.userId", data, op));
				  }
				
				 if ("orderId".equals(filet)) {
					query.alias("decoration", "decoration");
					query.add(query.getCriterion("decoration.orderId", data, op));
				  } 
				
				 if ("duty".equals(filet)) {
					query.alias("user", "user");
					query.alias("user.duty", "duty");
					query.add(query.getCriterion("duty.name", data, op));
					
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
	
	private void queryFilterExcuteForWorker(PagingQuery<?> query, List<Filter> filters) {
		
		if (filters != null) {
			for (Filter filter : filters) {
				
				String filet = filter.getField();
				String data = filter.getData();
				
				 if ("wuid".equals(filet)) {
						query.alias("user", "user");
						query.add(Restrictions.eq("user.uid", Integer.valueOf(data)));
				  }
				 
				 if ("startTime".equals(filet)) {
					 query.add(Restrictions.ge("createTime", Timestamp.valueOf(data)));
				 }
				 
				 if ("endTime".equals(filet)) {
					 query.add(Restrictions.le("createTime", Timestamp.valueOf(data)));
				 }
				 
			}
		}
		
	}


}

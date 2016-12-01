/**
 * @File Name		: WorkerBaseSalaryDaoImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.Paging;

@Repository("workerBaseSalaryDao")
public class WorkerBaseSalaryDaoImpl extends DaoImpl<WorkerBaseSalaryPO> implements WorkerBaseSalaryDao {
	
	public WorkerBaseSalaryDaoImpl(){
		super(WorkerBaseSalaryPO.class);
	}

	@Override
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalary(Paging paging, List<Filter> filters){
		
		PagingQuery<WorkerBaseSalaryPO> query = pagingQuery(paging, WorkerBaseSalaryPO.class);
		
		query.add(query.getCriterion(WorkerBaseSalaryPO.COLUMN_ORDERID_STR, "", "ne"));
		
		if(filters != null){
			for(Filter filter: filters){
				if(WorkerBaseSalaryPO.COLUMN_WORKTYPEID_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else if(WorkerBaseSalaryPO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter));
				}
				
			}
		}else{
			return new ArrayList<WorkerBaseSalaryPO>();
		}
		
		return query.list();
	}

	@Override
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalaryByStatus(Paging paging, List<Filter> filters, List<Integer> status){
		
		PagingQuery<WorkerBaseSalaryPO> query = pagingQuery(paging, WorkerBaseSalaryPO.class);
		
		query.add(query.getCriterion(WorkerBaseSalaryPO.COLUMN_ORDERID_STR, "", "ne"));
		query.add(query.getCriterion(WorkerBaseSalaryPO.COLUMN_WORKTYPEID_STR, "", "ne"));
		
		if(status != null){
			query.add(Restrictions.in(WorkerBaseSalaryPO.COLUMN_STATUS_STR, status));
		}
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}else{
			return new ArrayList<WorkerBaseSalaryPO>();
		}
		
		return query.list();
	}

	@Override
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalaryByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		PagingQuery<WorkerBaseSalaryPO> query = pagingQuery(paging, WorkerBaseSalaryPO.class);
		
		query.add(query.getCriterion(WorkerBaseSalaryPO.COLUMN_ORDERID_STR, orderId, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				if(WorkerBaseSalaryPO.COLUMN_WORKTYPEID_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WorkerBaseSalaryPO> queryWorkerBaseSalaryByOrderId(String orderId){
		return session().createCriteria(WorkerBaseSalaryPO.class).add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_ORDERID_STR, orderId)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WorkerBaseSalaryPO> queryWorkerBaseSalaryByWsIdPayOff(int wsId){
		return session().createCriteria(WorkerBaseSalaryPO.class)
				.add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_WSID_STR, wsId))
				.add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_STATUS_STR, WorkerBaseSalaryPO.STATUS_TYPE_CONFIRM_INT))
				.list();
	}

	@Override
	public WorkerBaseSalaryPO queryWorkerBaseSalaryByCswId(int cswId){
		return (WorkerBaseSalaryPO) session().createCriteria(WorkerBaseSalaryPO.class).add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_CSWID_INT, cswId)).uniqueResult();
	}
	
	@Override
	public WorkerBaseSalaryPO queryWorkerBaseSalaryByCswIdWorkTypeId(int cswId, int workTypeId){
		return (WorkerBaseSalaryPO) session().createCriteria(WorkerBaseSalaryPO.class)
				.add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_CSWID_INT, cswId))
				.add(Restrictions.eq(WorkerBaseSalaryPO.COLUMN_WORKTYPEID_STR, workTypeId))
				.uniqueResult();
	}

}


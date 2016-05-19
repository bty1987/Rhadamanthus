/**
 * @File Name		: WorkerDeductSalaryDao.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-29
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.po.WorkerDeductSalaryPO;
import com.fanglin.utils.Paging;

@Repository("workerDeductSalaryDao")
public class WorkerDeductSalaryDaoImpl extends DaoImpl<WorkerDeductSalaryPO> implements com.fanglin.salary.dao.WorkerDeductSalaryDao {
	
	public WorkerDeductSalaryDaoImpl(){
		super(WorkerDeductSalaryPO.class);
	}

	@Override
	public List<WorkerDeductSalaryPO> pageWorkerBaseSalary(Paging paging, List<FilterVO> filters, List<Integer> status){
		
		PagingQuery<WorkerDeductSalaryPO> query = pagingQuery(paging, WorkerDeductSalaryPO.class);
		
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_ORDERID_STR, "", "ne"));
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_WORKTYPEID_STR, "", "ne"));
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_WSID_STR, -1, "ne"));
		
		for(int _status: status){
			query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_STATUS_STR, _status, "eq"));
		}
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}else{
			return new ArrayList<WorkerDeductSalaryPO>();
		}
		
		return query.list();
	}

	@Override
	public List<WorkerDeductSalaryPO> pageWorkerDeductSalaryByOrderId(Paging paging, List<FilterVO> filters, String orderId){
		
		PagingQuery<WorkerDeductSalaryPO> query = pagingQuery(paging, WorkerDeductSalaryPO.class);
		
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_ORDERID_STR, orderId, "eq"));
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_WORKTYPEID_STR, "", "ne"));
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_WSID_STR, -1, "ne"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(WorkerDeductSalaryPO.COLUMN_WORKTYPEID_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter));
				}
				
			}
		}
		
		return query.list();
	}

	@Override
	public List<WorkerDeductSalaryPO> pageWorkerDeductSalaryPersonal(Paging paging, List<FilterVO> filters){
		
		PagingQuery<WorkerDeductSalaryPO> query = pagingQuery(paging, WorkerDeductSalaryPO.class);
		
		query.add(query.getCriterion(WorkerDeductSalaryPO.COLUMN_ORDERID_STR, "", "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}else{
			return new ArrayList<WorkerDeductSalaryPO>();
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerDeductSalaryPO> queryWorkerdeductByWsIdPayOff(int wsId){
		return session().createCriteria(WorkerDeductSalaryPO.class)
				.add(Restrictions.ne(WorkerDeductSalaryPO.COLUMN_ORDERID_STR, ""))
				.add(Restrictions.ne(WorkerDeductSalaryPO.COLUMN_WORKTYPEID_STR, -1))
				.add(Restrictions.eq(WorkerDeductSalaryPO.COLUMN_WSID_STR, wsId))
				.add(Restrictions.eq(WorkerDeductSalaryPO.COLUMN_STATUS_STR, WorkerDeductSalaryPO.STATUS_TYPE_CONFIRM_INT))
				.list();
	}

}

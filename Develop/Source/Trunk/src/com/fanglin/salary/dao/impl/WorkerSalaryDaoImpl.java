/**
 * @File Name		: WorkerSalaryDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

@Repository("workerSalaryDao")
public class WorkerSalaryDaoImpl extends DaoImpl<WorkerSalaryPO> implements WorkerSalaryDao {
	
	public WorkerSalaryDaoImpl(){
		super(WorkerSalaryPO.class);
	}

	@Override
	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<FilterVO> filters, List<Integer> status){
		
		PagingQuery<WorkerSalaryPO> query = pagingQuery(paging, WorkerSalaryPO.class);
		
		if(status != null){
			query.add(Restrictions.in(WorkerSalaryPO.COLUMN_STATUS_STR, status));
		}
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(WorkerSalaryPO.COLUMN_WORKTYPEID_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter));
				}
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerSalaryPO> queryWorkerSalary(List<Integer> status){
		return session().createCriteria(WorkerSalaryPO.class).add(Restrictions.in(WorkerSalaryPO.COLUMN_STATUS_STR, status)).list();
	}

	@Override
	public WorkerSalaryPO queryWorkerSalaryByUserIdInit(String userId){
		return (WorkerSalaryPO) session().createCriteria(WorkerSalaryPO.class)
				.add(Restrictions.eq(WorkerSalaryPO.COLUMN_USERID_STR, userId))
				.add(Restrictions.eq(WorkerSalaryPO.COLUMN_STATUS_STR, WorkerSalaryPO.STATUS_TYPE_INIT_INT))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WorkerSalaryPO> queryWorkerSalaryByUserIdPayOff(String userId){
		return session().createCriteria(WorkerSalaryPO.class)
				.add(Restrictions.eq(WorkerSalaryPO.COLUMN_USERID_STR, userId))
				.add(Restrictions.eq(WorkerSalaryPO.COLUMN_STATUS_STR, WorkerSalaryPO.STATUS_TYPE_PAYOFF))
				.list();
	}

	@Override
	public WorkerSalaryPO queryWorkerSalaryByWsId(int wsId){
		return (WorkerSalaryPO) session().createCriteria(WorkerSalaryPO.class).add(Restrictions.eq(WorkerSalaryPO.COLUMN_WSID_STR, wsId)).uniqueResult();
	}

}

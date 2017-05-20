package com.fanglin.salary.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("workerSalaryDao")
public class WorkerSalaryDaoImpl extends DaoImpl<WorkerSalaryPO> implements WorkerSalaryDao{
	
	public WorkerSalaryDaoImpl(){
		super(WorkerSalaryPO.class);
	}
	
	@Override
	public WorkerSalaryPO queryWorkerSalaryByCsIdAndUserId(String userId,Long csId) {
		return (WorkerSalaryPO)session().createCriteria(WorkerSalaryPO.class).add(Restrictions.eq(WorkerSalaryPO.COLUMN_CSID_STR, csId))
				.add(Restrictions.eq(WorkerSalaryPO.COLUMN_USER_USERID_STR,userId)).uniqueResult();
	}
	
}

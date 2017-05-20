package com.fanglin.salary.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.salary.po.WorkerSalaryPO;

public interface WorkerSalaryDao extends Dao<WorkerSalaryPO>{
	
	public WorkerSalaryPO queryWorkerSalaryByCsIdAndUserId(String userId,Long csId);
	
}

package com.fanglin.salary.dao;

import com.fanglin.salary.po.WorkerSalaryPO;

public interface WorkerSalaryDao {
	
	public WorkerSalaryPO queryWorkerSalaryByCsIdAndUserId(String userId,Long csId);

	public void addWorkerSalary(WorkerSalaryPO workerSalaryPO);

	public void updateWorkerSalary(WorkerSalaryPO workerSalaryPO);

}

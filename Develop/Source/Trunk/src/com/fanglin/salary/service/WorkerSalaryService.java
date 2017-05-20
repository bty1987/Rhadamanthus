package com.fanglin.salary.service;

import com.fanglin.salary.vo.WorkerSalaryVO;

public interface WorkerSalaryService {
	
	public WorkerSalaryVO queryWorkerSalaryByCsIdAndUserId(WorkerSalaryVO workerSalaryVO);
	
	public void updateWorkerSalary(WorkerSalaryVO workerSalaryVO);
	
}

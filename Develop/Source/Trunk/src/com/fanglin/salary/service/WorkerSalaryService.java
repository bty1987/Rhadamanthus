package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryService {
	
	public void pageWorkerSalary(Paging paging,List<Filter> filters);
	
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalary);
	
	public void addWorkerSalary(WorkerSalaryVO workerSalaryVO)throws FLException;
	
	public int updateWorkerSalary(WorkerSalaryVO workerSalaryVO)throws FLException ;
	
	public void deleteWorkerSalary(WorkerSalaryVO workerSalaryVO) throws FLException;

	
}

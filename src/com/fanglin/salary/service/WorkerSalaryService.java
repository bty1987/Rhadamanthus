package com.fanglin.salary.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryService {
	
	public void pageWorkerSalary(Paging paging,List<Filter> filters,int company);
	
	public void pageWorkerSalaryByUserId(Paging paging,List<Filter> filters);
	
	public List<WorkerSalaryVO> queryWorkerSalary(WorkerSalaryVO workerSalary);
	
	public int addWorkerSalary(WorkerSalaryVO workerSalaryVO,String userId,int company)throws FLException;
	
	public int adoptWorkerSalary(List<WorkerSalaryVO> workerSalarys,String userId, int company) throws FLException;
	
	public int rejectWorkerSalary(WorkerSalaryVO workerSalarys,String userId, int company) throws FLException;
	
	public int deleteWorkerSalary(WorkerSalaryVO workerSalarys,String userId, int company) throws FLException;
	
	public int collectWorkerDeposit(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException;
	
	public int drawWorkerDeposit(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException;
	
	public int cutWorkerSalary(WorkerSalaryVO workerSalarys, String userId, int company) throws FLException;
	
	public int tranWorkerSalary(WorkerSalaryVO workerSalarys, String userId, String sourceId, String targetId, int company) throws FLException;
	
	public int payWorkerSalary(WorkerSalaryVO workerSalaryVO,String userId, int company)throws FLException;
	
}

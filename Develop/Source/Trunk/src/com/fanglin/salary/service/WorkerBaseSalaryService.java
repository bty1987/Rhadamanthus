/**
 * @File Name		: WorkerBaseSalaryService.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-10-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.vo.WorkerBaseSalaryVO;
import com.fanglin.utils.Paging;

public interface WorkerBaseSalaryService {
	
	public void pageWorkerBaseSalaryByOrderIdAUserId(Paging paging, List<FilterVO> filters, WorkerBaseSalaryVO workerBaseSalaryVO, String userId);
	
	public void pageWorkerBaseSalary(Paging paging, List<FilterVO> filters);
	
	public void pageWorkerBaseSalaryForPass(Paging paging, List<FilterVO> filters);
	
	public List<WorkerBaseSalaryVO> queryWorkerBaseSalaryByOrder(WorkerBaseSalaryVO workerBaseSalaryVO);
	
	public int addWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO, String userId) throws FLException;
	
	public void updateWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO);
	
	public int passWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO, String userId) throws FLException;
	
	public void confirmWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO);
	
	public void cancelWorkerBaseSalaryToInit(WorkerBaseSalaryVO workerBaseSalaryVO, String userId);
	
	public void cancelWorkerBaseSalaryToConfirm(WorkerBaseSalaryVO workerBaseSalaryVO);
	
	public int deleteWorkerBaseSalarys(List<Integer> wbsIds);

}

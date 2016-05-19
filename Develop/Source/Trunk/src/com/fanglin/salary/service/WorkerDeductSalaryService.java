/**
 * @File Name		: WorkerDeductSalaryService.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-10-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.vo.WorkerDeductSalaryVO;
import com.fanglin.utils.Paging;

public interface WorkerDeductSalaryService {
	
	public void pageWorkerDeductSalaryByOrderIdAUserId(Paging paging, List<FilterVO> filters, WorkerDeductSalaryVO workerDeductSalaryVO, String userId);
	
	public void pageWorkerDedectSalaryByPass(Paging paging, List<FilterVO> filters);
	
	public void pageWorkerDeductSalaryForPersonal(Paging paging, List<FilterVO> filters, WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void addWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void updateWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void passWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void confirmWorkerDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void cancelWorkerDeductSalaryToInit(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public void cancelWorkerDeductSalaryToConfirm(WorkerDeductSalaryVO workerDeductSalaryVO);
	
	public int deleteWorkerDeductSalarys(List<Integer> wdsIds);

}

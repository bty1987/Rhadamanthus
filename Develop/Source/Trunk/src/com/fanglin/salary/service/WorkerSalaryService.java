/**
 * @File Name		: WorkerSalaryDao.java
 * @Package   	: com.fanglin.service.salary
 * @Version		: 1.0
 * @Date			: 2014-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.WorkerSalaryExcelVO;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryService {
	
	public void pageWorkerSalaryForInit(Paging paging, List<Filter> filters);
	
	public void pageWorkerSalaryForPayOff(Paging paging, List<Filter> filters);
	
	public void pageWorkerSalaryForUnPayOff(Paging paging, List<Filter> filters);
	
	public List<WorkerSalaryExcelVO> payoffWorkerSalary();
	
	public void payoffWorkerSalary(WorkerSalaryVO workerSalaryVO);
	
	public void unPayoffWorkerSalary(WorkerSalaryVO workerSalaryVO);

}

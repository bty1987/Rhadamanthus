package com.fanglin.salary.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

import java.util.List;

public  interface WorkerSalaryDao extends Dao<WorkerSalaryPO>{
	
	public  List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<Filter> filters, int company);
	
	public  List<WorkerSalaryPO> pageWorkerSalaryByUserId(Paging paging, List<Filter> filters);
  
	public  List<WorkerSalaryPO> queryWorkerSalary(String userId, Long cid);
	
	public  List<WorkerSalaryPO> queryWorkerSalaryByuid(int wuid);
  
	public  int countWorkerSalary(Long cid, Integer wuid);
	
}

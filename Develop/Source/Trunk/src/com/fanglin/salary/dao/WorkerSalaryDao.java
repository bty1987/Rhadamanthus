package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryDao extends Dao<WorkerSalaryPO>{
	
	public List<WorkerSalaryPO>  pageWorkerSalary(Paging paging,List<Filter> filters,int company);

	public List<WorkerSalaryPO> queryWorkerSalary(String userId,Long csId);
	
	public  int countWorkerSalary(Long csId, String userId);

	public  void  deleteWorkerSalary (Long wsid);
	
}

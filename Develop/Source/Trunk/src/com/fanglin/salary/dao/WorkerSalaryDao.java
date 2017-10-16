package com.fanglin.salary.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;
import java.util.List;

public  interface WorkerSalaryDao extends Dao<WorkerSalaryPO>{
	
  public  List<WorkerSalaryPO> pageWorkerSalary(Paging Paging, List<Filter> List, int Int);
  
  public  List<WorkerSalaryPO> queryWorkerSalary(String String, Long Long);
  
  public  int countWorkerSalary(Long Long, String String);

}

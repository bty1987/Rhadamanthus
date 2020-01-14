package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryDao extends Dao<WorkerSalaryPO> {

	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<Filter> filters, int company);

	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<Filter> filters);

	public List<WorkerSalaryPO> queryWorkerSalary(String userId, Long csid);

	public List<WorkerSalaryPO> queryWorkerSalary(int wuid);

	public List<WorkerSalaryPO> queryWorkerSalaryByCwsid(Long wsid);

	public int countWorkerSalary(Long cid, Integer wuid);

}

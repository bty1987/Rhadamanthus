/**
 * @File Name		: WorkerSalaryDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-10-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.Paging;

public interface WorkerBaseSalaryDao extends Dao<WorkerBaseSalaryPO> {
	
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalary(Paging paging, List<Filter> filters);
	
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalaryByStatus(Paging paging, List<Filter> filters, List<Integer> status);
	
	public List<WorkerBaseSalaryPO> pageWorkerBaseSalaryByOrderId(Paging paging, List<Filter> filters, String orderId) ;
	
	public List<WorkerBaseSalaryPO> queryWorkerBaseSalaryByOrderId(String orderId);
	
	public List<WorkerBaseSalaryPO> queryWorkerBaseSalaryByWsIdPayOff(int wsId);
	
	public WorkerBaseSalaryPO queryWorkerBaseSalaryByCswId(int cswId);

	public WorkerBaseSalaryPO queryWorkerBaseSalaryByCswIdWorkTypeId(int cswId, int workTypeId);
	
}

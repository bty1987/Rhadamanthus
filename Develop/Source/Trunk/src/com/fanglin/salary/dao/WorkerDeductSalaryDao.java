/**
 * @File Name		: WorkerDeductSalaryDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-10-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerDeductSalaryPO;
import com.fanglin.utils.Paging;

public interface WorkerDeductSalaryDao extends Dao<WorkerDeductSalaryPO>{
	
	public List<WorkerDeductSalaryPO> pageWorkerBaseSalary(Paging paging, List<Filter> filters, List<Integer> status);
	
	public List<WorkerDeductSalaryPO> pageWorkerDeductSalaryByOrderId(Paging paging, List<Filter> filters, String orderId);
	
	public List<WorkerDeductSalaryPO> pageWorkerDeductSalaryPersonal(Paging paging, List<Filter> filters);
	
	public List<WorkerDeductSalaryPO> queryWorkerdeductByWsIdPayOff(int wsId);
	
}

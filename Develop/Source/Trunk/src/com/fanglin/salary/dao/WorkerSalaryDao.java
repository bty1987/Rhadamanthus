/**
 * @File Name		: WorkerSalaryDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Paging;

public interface WorkerSalaryDao extends Dao<WorkerSalaryPO>{
	
	public List<WorkerSalaryPO> pageWorkerSalary(Paging paging, List<FilterVO> filters, List<Integer> status);
	
	public List<WorkerSalaryPO> queryWorkerSalary(List<Integer> status);
	
	public WorkerSalaryPO queryWorkerSalaryByUserIdInit(String userId);
	
	public List<WorkerSalaryPO> queryWorkerSalaryByUserIdPayOff(String userId);
	
	public WorkerSalaryPO queryWorkerSalaryByWsId(int wsId);
	
}

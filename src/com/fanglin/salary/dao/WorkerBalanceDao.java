package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.WorkerBalancePO;
import com.fanglin.utils.Paging;

public interface WorkerBalanceDao extends Dao<WorkerBalancePO> {
	
	public List<WorkerBalancePO> pageWorkerBalance(Paging paging,List<Filter> filters);
	
	public WorkerBalancePO queryWorkerBalanceByUserId(int uid);

}

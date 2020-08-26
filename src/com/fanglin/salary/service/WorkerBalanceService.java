package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.vo.WorkerBalanceVO;
import com.fanglin.utils.Paging;

public interface WorkerBalanceService {
	
	public void pageWorkerBalance(Paging paging, List<Filter> filters,int company);
	
	public int addWorkerBalance(WorkerBalanceVO workerBalanceVO, int company) throws FLException;
	
	public int updateWorkerBalance(WorkerBalanceVO workerBalanceVO)throws FLException;
}

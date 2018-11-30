package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface WorkerBalanceService {
	
	public void pageWorkerBalance(Paging paging, List<Filter> filters);
	
}

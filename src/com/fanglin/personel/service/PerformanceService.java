package com.fanglin.personel.service;
import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.PerformanceVO;
import com.fanglin.utils.Paging;

public interface PerformanceService {
	
	public void pagePerformance (Paging paging, List<Filter> filters);
	
	public void addPreformance (PerformanceVO performance) throws FLException;

}

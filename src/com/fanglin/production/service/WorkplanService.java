package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.WorkplanVO;
import com.fanglin.utils.Paging;

public interface WorkplanService {
	public void pageWorkplan(Paging paging, List<Filter> filters,int company);

	public List<WorkplanVO> queryWorkplan(int company);
	
	public List<WorkplanVO> queryWorkplanByWsid(WorkplanVO workplanVO,int company);
	
	public int addWorkplan(WorkplanVO workplanVO,int company) throws FLException;

	public int updateWorkplan(WorkplanVO workplanVO) throws FLException;

	public int updateWorkplanForStatus(WorkplanVO workplanVO) throws FLException;
}

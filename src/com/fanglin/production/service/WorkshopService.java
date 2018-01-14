package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.WorkshopVO;
import com.fanglin.utils.Paging;

public interface WorkshopService {

	public void pageWorkshop(Paging paging, List<Filter> filters,int company);
	
	public List<WorkshopVO> queryWorkshop(int company);
	
	public int addWorkshop(WorkshopVO workshopVO, int company);
	
	public int updateWorkshop(WorkshopVO workshopVO) throws FLException;
	
	public int updateWorkshopForStatus(WorkshopVO workshopVO) throws FLException;
	
}

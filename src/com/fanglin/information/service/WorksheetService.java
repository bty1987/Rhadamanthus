package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.WorksheetVO;
import com.fanglin.utils.Paging;

public interface WorksheetService {

	public void pageWorksheet(Paging paging, List<Filter> filters, int company) throws FLException;
	
	public void addWorksheet(WorksheetVO worksheet, String userId, int company) throws FLException;
	
	public void cancelWorksheet(WorksheetVO worksheet, String userId, int company) throws FLException;
	
	public void handleWorksheet(WorksheetVO worksheet, String userId, int company) throws FLException;
	
}

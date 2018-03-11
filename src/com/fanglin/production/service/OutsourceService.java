package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.utils.Paging;

public interface OutsourceService {
	
	public void pageOutsource (Paging paging ,List<Filter> filter,long pid);
	
	public void addOutsource (OutsourceVO outsource);
	
	public int updateOutsource(OutsourceVO outsource) throws FLException;
	
	public int updateOutsourceForStatus(OutsourceVO outsource) throws FLException;

	public int deleteOutsource(OutsourceVO outsource) throws FLException;

}

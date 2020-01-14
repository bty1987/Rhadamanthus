package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.utils.Paging;

public interface OutsourceService {
	
	public void pageOutsource (Paging paging ,List<Filter> filter,int company);
	
	public void pageOutsourceForSupplier (Paging paging ,List<Filter> filter,String userId,int company);
	
	public void addOutsource (OutsourceVO outsource,String userId,int company) throws FLException;
	
	public int updateOutsource(OutsourceVO outsource) throws FLException;
	
	public int passOutsource(OutsourceVO outsource) throws FLException;
	
	public int confirmOutsource(OutsourceVO outsource) throws FLException;
	
	public int deleteOutsource(OutsourceVO outsource) throws FLException;

	public List<OutsourceVO> queryOutsourceByPid(OutsourceVO outsourceVO,int company);

	public int finishOutsource(OutsourceVO outsource, String userId) throws FLException;

}

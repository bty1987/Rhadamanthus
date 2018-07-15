package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ServiceNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ServiceNodeService {

	public void pageServiceNode(Paging paging, List<Filter> filters, int company);
	
	public int addServiceNode(ServiceNodeVO serviceNodeVO);
	
	public int updateServiceNode(ServiceNodeVO serviceNodeVO) throws FLException;
	
	public int updateServiceNodeForStatus(ServiceNodeVO serviceNodeVO) throws FLException;
	
}

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.AssisTypeVO;
import com.fanglin.utils.Paging;

public interface AssisTypeService {
	
	public void pageAssisType(Paging paging, List<Filter> filters);
	
	public List<AssisTypeVO> queryAssisType();
	
	public List<AssisTypeVO> queryAssisTypeByWtid(AssisTypeVO assisTypeVO);
	
	public int addAssisType(AssisTypeVO assisTypeVO) throws FLException;
	
	public int updateAssisType(AssisTypeVO assisTypeVO) throws FLException;
	
	public int updateAssisTypeForStatus(AssisTypeVO assisTypeVO) throws FLException;
	
}

package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.utils.Paging;

public interface AccessoriesTypeService {
	
	public void pageAccessoriesType(Paging paging, List<Filter> filters);
	
	public List<AccessoriesTypeVO> queryAccessoriesType();
	
	public List<AccessoriesTypeVO> queryAccessoriesTypeByWtid(AccessoriesTypeVO accessoriesTypeVO);
	
	public int addAccessoriesType(AccessoriesTypeVO accessoriesTypeVO) throws FLException;
	
	public int updateAccessoriesType(AccessoriesTypeVO accessoriesTypeVO) throws FLException;
	
	public int updateAccessoriesTypeForStatus(AccessoriesTypeVO accessoriesTypeVO) throws FLException;
	
}

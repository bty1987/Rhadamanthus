package com.fanglin.inventory.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.utils.Paging;

public interface AccessoriesService {
	
	public void pageAccessories(Paging paging, List<Filter> filters,int company);
	
	public int addAccessories(AccessoriesVO accessoriesVO,List<AccessoriesItemVO> accessoriesItemVOs, String userId) throws FLException;
	
	public int preoutAccessories(AccessoriesVO accessoriesVO,String userId) throws FLException;
	
	public int cancelAccessories(AccessoriesVO accessoriesVO,String userId) throws FLException;
	
	public int refuseAccessories(AccessoriesVO accessoriesVO,String userId) throws FLException;
	
	public int updateAccessoriesForPrint(AccessoriesVO accessoriesVO) throws FLException;
	
	public int deliveAccessories(AccessoriesVO accessoriesVO,String userId) throws FLException;
	
}

package com.fanglin.inventory.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.utils.Paging;

public interface AccessoriesService {
	
	public void pageAccessories(Paging paging, List<Filter> filters,int company);
	
	public int addAccessories(AccessoriesVO accessoriesVO,List<AccessoriesItemVO> accessoriesItemVOs, String creater, String approver,int company) throws FLException;
	
	public int refundAccessories(AccessoriesVO accessoriesVO,List<AccessoriesItemVO> accessoriesItemVOs, String creater, String approver,int company) throws FLException;
	
	public int updateAccessoriesForStatus(AccessoriesVO accessoriesVO,String userId) throws FLException;
	
}

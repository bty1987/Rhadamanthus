package com.fanglin.inventory.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.AssisOrderItemVO;
import com.fanglin.inventory.vo.AssisOrderVO;
import com.fanglin.utils.Paging;

public interface AssisOrderService {
	
	public void pageAssisOrder(Paging paging, List<Filter> filters,int company);
	
	public int addAssisOrder(AssisOrderVO AssisOrderVO,List<AssisOrderItemVO> assisOrderItemVOs, String creater, String approver,int company);
	
	public int updateAssisOrderForStatus(AssisOrderVO assisOrderVO,String userId) throws FLException;
	
}

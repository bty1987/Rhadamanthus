package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.AssisOrderItemVO;
import com.fanglin.inventory.vo.AssisOrderVO;

public interface AssisOrderItemService {
	
	public List<AssisOrderItemVO> queryAssisOrderItemByAoid(AssisOrderItemVO assisOrderItemVO);
	
	public List<AssisOrderItemVO> queryAssisOrderItemByAoids(List<Long> aoids);
	
	public int addAssisOrderItem(AssisOrderVO assisOrderVO, AssisOrderItemVO assisOrderItemVO) throws FLException;
	
	public int updateAssisOrderItem(AssisOrderVO assisOrderVO,AssisOrderItemVO assisOrderItemVO) throws FLException;
	
	public int deleteAssisOrderItem(AssisOrderVO assisOrderVO,AssisOrderItemVO assisOrderItemVO) throws FLException;
	
}

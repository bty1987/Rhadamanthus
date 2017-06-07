package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.SalesItemVO;
import com.fanglin.inventory.vo.SalesVO;

public interface SalesItemService {
	
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO);
	
	public List<SalesItemVO> querySalesItemBySids(List<Long> sids);
	
	public int addSalesItem(SalesVO salesVO,SalesItemVO salesItemVO) throws FLException;
	
	public int updateSalesItem(SalesItemVO salesItemVO) throws FLException;
	
	public int deleteSalesItem(SalesItemVO salesItemVO) throws FLException;
}

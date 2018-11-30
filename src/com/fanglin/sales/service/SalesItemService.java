package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesItemVO;
import com.fanglin.sales.vo.SalesVO;

public interface SalesItemService {
	
	public List<SalesItemVO> querySalesItemBySid(SalesVO salesVO);
	
	public List<SalesItemVO> querySalesItemBySids(List<Long> sids);
	
	public int addSalesItem(SalesVO salesVO,List<SalesItemVO> salesItemVOs) throws FLException;
	
	public int updateSalesItem(SalesItemVO salesItemVO) throws FLException;
	
	public int updateSalesItemForBalance(SalesItemVO salesItemVO) throws FLException;
	
	public int deleteSalesItem(SalesItemVO salesItemVO) throws FLException;
	
	public Float countSalesItemForAmount(SalesItemVO salesItemVO) throws FLException;
}

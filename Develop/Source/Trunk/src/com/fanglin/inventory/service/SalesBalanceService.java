package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.SalesBalanceVO;
import com.fanglin.utils.Paging;

public interface SalesBalanceService {

	public void pageSalesBalance(Paging paging,List<Filter> filter);
	
	public int updateSalesBalanceForVBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int updateSalesBalanceForPBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int passSalesBalance(List<Long> sid) throws FLException;
	
	public int preSalesBalance(List<Long> sid , String userId) throws FLException;
	
	public int vpostSalesBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int postSalesBalance(SalesBalanceVO salesBalanceVO,String userId) throws FLException;
	
}

package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.vo.SalesBalanceVO;
import com.fanglin.utils.Paging;

public interface SalesBalanceService {

	public void pageSalesBalance(Paging paging,List<Filter> filter,int company);
	
	public List<SalesBalanceVO> pageSalesBalance(List<SalesBalancePO> salesBalancePOs);
	
	public void pageSalesBalanceForDompany(Paging paging,List<Filter> filter,int dompany);
	
	public void pageSalesBalanceForPompany(Paging paging,List<Filter> filter,int pompany);
	
	public void pageSalesBalanceForSupplier(Paging paging,List<Filter> filter,String userId, int pompany);
	
	public int updateSalesBalanceForVBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int updateSalesBalanceForPBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int rpreSalesBalance(SalesBalanceVO salesBalanceVO) throws FLException;
	
	public int passSalesBalance(List<Long> sid) throws FLException;
	
	public int preSalesBalance(List<Long> sid , String userId) throws FLException;
	
	public int vpostSalesBalance(List<SalesBalanceVO> sbid) throws FLException;
	
	public int postSalesBalance(List<SalesBalanceVO> sbids,String userId) throws FLException;
	
}

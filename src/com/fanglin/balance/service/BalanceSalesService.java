package com.fanglin.balance.service;

import java.util.List;


import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesBalanceVO;

public interface BalanceSalesService {

	public List<SalesBalanceVO> queryBalanceSalesForSales(BalanceSalesVO balanceSalesVO);
	
	public List<BalanceVO> queryBalanceSalesForBalance(BalanceSalesVO balanceSalesVO);
	
	public int submitBalanceSales(List<BalanceSalesVO> balanceSalesVOs, String userId, int company) throws FLException;
}

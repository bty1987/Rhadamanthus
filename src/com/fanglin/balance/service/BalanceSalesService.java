package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSalesService {

	public void pageBalanceSales(Paging paging, List<Filter> filters, int company);

	public int createBalanceSales(BalanceSalesVO balanceSalesVO, String userId, int company) throws FLException;

	public List<BalanceSalesVO> queryBalanceSales(BalanceSalesVO balanceSalesVO, int company);

	public BalanceSalesVO queryBalanceSalesByBsid(BalanceSalesVO balanceSalesVO);

	public int submitBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalances, String userId, int company) throws FLException;

	public int unbindBalanceSales(BalanceSalesVO balanceSalesVO, List<BalanceSalesBalanceVO> balanceSalesBalances, String userId, int company) throws FLException;

	public int updateBalanceSales(BalanceSalesVO balanceSales) throws FLException;
	
	public int balanceBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException;
	
	public int lockBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException;
	
	public int unlockBalanceSales(BalanceSalesVO balanceSalesVO) throws FLException;

}

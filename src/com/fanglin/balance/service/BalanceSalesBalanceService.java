package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.balance.vo.BalanceSalesVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSalesBalanceService {

	public void pageBalanceSalesBalance(Paging paging, List<Filter> filters, BalanceSalesBalanceVO balanceSalesBalance) throws FLException;

	public List<BalanceSalesBalanceVO> queryBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance);

	public int countBalanceSalesBalance(BalanceSalesVO balanceSales);

	public int submitBalanceSalesBalance(BalanceSalesVO balanceSales, BalanceSalesBalanceVO balanceSalesBalanceVO, String userId, int company) throws FLException;

}

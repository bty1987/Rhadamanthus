package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.AccountVO;
import com.fanglin.balance.vo.BalanceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceService {
	
	public void pageBalance(Paging paging, List<Filter> filters, int company);
	
	public int addBalance(BalanceVO balanceVO, String userId, int company);
	
	public int balanceBalance(BalanceVO balanceVO, List<AccountVO> accounts, String userId) throws FLException;
	
	public int payBalance(BalanceVO balanceVO, List<AccountVO> accounts, String userId) throws FLException;

}

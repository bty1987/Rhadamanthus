package com.fanglin.balance.service;

import java.util.List;


import com.fanglin.balance.vo.BalanceAccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceAccountService {
	
	public void pageBalanceAccount(Paging paging, List<Filter> filters, String userId);
	
	public List<BalanceAccountVO> queryBalanceAccount(BalanceAccountVO balanceAccountVO);
	
	public void addBalanceAccount(BalanceAccountVO balanceAccountVO, String userId, int company) throws FLException;

	public void updateBalanceAccount(BalanceAccountVO balanceAccountVO) throws FLException;

	public void updateBalanceAccountForStatus(BalanceAccountVO balanceAccountVO) throws FLException;
	
	public List<BalanceAccountVO> queryBalanceAccountForTeller(int company);
	
	public void withdrawBalanceAccount(BalanceAccountVO balanceAccountVO, String userId, int company) throws FLException ;
}

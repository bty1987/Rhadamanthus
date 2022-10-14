package com.fanglin.balance.service;

import java.util.List;


import com.fanglin.balance.vo.BalanceAccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceAccountesService {
	
	public void pageBalanceAccount(Paging paging, List<Filter> filters, String userId);
	
	public List<BalanceAccountVO> queryBalanceAccount(BalanceAccountVO balanceAccountesVO);
	
	public void addBalanceAccount(BalanceAccountVO balanceAccountesVO, String userId) throws FLException;
	
	public void updateBalanceAccountForStatus(BalanceAccountVO balanceAccountesVO) throws FLException;
}

package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSalesBalanceVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSalesBalanceService {
	
	public void pageBalanceSalesBalance(Paging paging, List<Filter> filters, long bsid);

	public List<BalanceSalesBalanceVO> queryBalanceSalesBalance(BalanceSalesBalanceVO balanceSalesBalance);
	
	public int countBalanceSalesBalance(long bsid);

}

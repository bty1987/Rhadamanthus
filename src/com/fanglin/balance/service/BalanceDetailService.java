package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceDetailVO;

public interface BalanceDetailService {
	
	
	public List<BalanceDetailVO> queryBalanceDetailForBalance(BalanceDetailVO balanceDetailVO);
}

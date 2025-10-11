package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceApportVO;
import com.fanglin.core.interceptor.FLException;

public interface BalanceApportService {

	public List<BalanceApportVO> queryBalanceApportForBalance(BalanceApportVO balanceApportVO);

	public int addBalanceApport(BalanceApportVO balanceApportVO, String userId) throws FLException;
}

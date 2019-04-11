package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationBalanceVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationBalanceService {
	
	public DecorationBalanceVO queryDecorationBalance(DecorationVO decorationVO);
	
	public int makeDecorationBalance(DecorationBalanceVO decorationBalanceVO, String userId) throws FLException;

}

package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.core.interceptor.FLException;

public interface BalanceCutpayService {

	public List<BalanceCutpayVO> queryBalanceCutpay(BalanceCutpayVO balanceCutpayVO);

	public int addBalanceCutpay(BalanceCutpayVO balanceCutpayVO,String userId) throws FLException;
}

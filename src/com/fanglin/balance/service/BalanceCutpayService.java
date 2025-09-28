package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceCutpayVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceCutpayService {

	public void pageBalanceCutpay(Paging paging, List<Filter> filters);

	public List<BalanceCutpayVO> queryBalanceCutpay(BalanceCutpayVO balanceCutpayVO);

	public List<BalanceCutpayVO> queryBalanceCutpayByOuid(BalanceCutpayVO balanceCutpayVO);

	public int addBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException;

	public int submitBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException;

	public int unbindBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException;

	public int deductBalanceCutpay(BalanceCutpayVO balanceCutpayVO, String userId) throws FLException;
}

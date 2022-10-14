package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceDccountVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceDccountService {

	public void pageBalanceDccount(Paging paging, List<Filter> filters, String userId);

	public List<BalanceDccountVO> queryBalanceDccount(BalanceDccountVO balanceDccountVO);

	public void addBalanceDccount(BalanceDccountVO balanceDccountVO, String userId) throws FLException;

	public void updateBalanceDccountForStatus(BalanceDccountVO balanceDccountVO) throws FLException;

	public int updateBalanceDccount(BalanceDccountVO balanceDccountVO) throws FLException;

}

package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceOalesService {

	public void pageBalanceOales(Paging paging, List<Filter> filters, int company) throws FLException;

	public void pageBalanceOalesForBalance(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<BalanceOalesVO> queryBalanceOales(BalanceOalesVO balanceOalesVO, int company);

	public BalanceOalesVO queryBalanceOalesByBoid(BalanceOalesVO balanceOalesVO);

	public int createBalanceOales(BalanceOalesVO balanceOalesVO, String userId, int company) throws FLException;

	public int submitBalanceOales(BalanceOalesVO balanceOalesVO, List<BalanceOalesItemVO> balanceOalesItems, String userId, int company) throws FLException;

	public int unbindBalanceOales(BalanceOalesVO balanceOalesVO, List<BalanceOalesItemVO> balanceOalesItems, String userId, int company) throws FLException;

	public int lockBalanceOales(BalanceOalesVO balanceOalesVO) throws FLException;

	public int unlockBalanceOales(BalanceOalesVO balanceOalesVO) throws FLException;

	public int updateBalanceOales(BalanceOalesVO balanceOales) throws FLException;

	public int balanceBalanceOales(BalanceOalesVO balanceOalesVO, String userId) throws FLException;

	public int deleteBalanceOales(BalanceOalesVO balanceOales) throws FLException;

	public int amountBalanceOales(BalanceOalesVO balanceOales) throws FLException;
}

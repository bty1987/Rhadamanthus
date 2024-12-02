package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSelectionService {

	public void pageBalanceSelection(Paging paging, List<Filter> filters, int company);

	public void pageBalanceSelectionForBalance(Paging paging, List<Filter> filters, BalanceSelectionVO balanceSelectionVO, int company);

	public List<BalanceSelectionVO> queryBalanceSelection(BalanceSelectionVO balanceSelectionVO, int company);

	public BalanceSelectionVO queryBalanceSelectionByBsid(BalanceSelectionVO balanceSelectionVO);

	public int createBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId, int company) throws FLException;

	public int submitBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItems, String userId, int company) throws FLException;

	public int unbindBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItems, String userId, int company) throws FLException;

	public int lockBalanceSelection(BalanceSelectionVO balanceSelectionVO) throws FLException;

	public int unlockBalanceSelection(BalanceSelectionVO balanceSelectionVO) throws FLException;

	public int updateBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;

	public int balanceBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int deleteBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;

	public int amountBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;
}

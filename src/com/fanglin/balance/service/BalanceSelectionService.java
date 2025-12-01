package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSelectionService {

	public void pageBalanceSelection(Paging paging, List<Filter> filters, int company) throws FLException;

	public void pageBalanceSelectionForBalance(Paging paging, List<Filter> filters, BalanceSelectionVO balanceSelectionVO, int company) throws FLException;

	public void pageBalanceSelectionForSupplier(Paging paging, List<Filter> filters, String userId, int company) throws FLException;

	public List<BalanceSelectionVO> queryBalanceSelection(BalanceSelectionVO balanceSelectionVO, int company);

	public BalanceSelectionVO queryBalanceSelectionByBsid(BalanceSelectionVO balanceSelectionVO);

	public int createBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId, int company) throws FLException;

	public int submitBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItems, String userId, int company) throws FLException;

	public int batchBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItems, String userId, int company) throws FLException;

	public int unbindBalanceSelection(BalanceSelectionVO balanceSelectionVO, List<BalanceSelectionItemVO> balanceSelectionItems, String userId, int company) throws FLException;

	public int lockBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int unlockBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int updateBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;

	public int balanceBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int auditBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int unauditBalanceSelection(BalanceSelectionVO balanceSelectionVO, String userId) throws FLException;

	public int deleteBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;

	public int amountBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;

	public int discountBalanceSelection(BalanceSelectionVO balanceSelection) throws FLException;
}

package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceSelectionItemVO;
import com.fanglin.balance.vo.BalanceSelectionVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSelectionItemService {

	public void pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid);

	public List<BalanceSelectionItemVO> queryBalanceSelectionItem(BalanceSelectionItemVO balanceSelectionItem);

	public int countBalanceSelectionItem(BalanceSelectionVO balanceSelection);

}

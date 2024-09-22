package com.fanglin.balance.service;

import java.util.List;

import com.fanglin.balance.vo.BalanceOalesItemVO;
import com.fanglin.balance.vo.BalanceOalesVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceOalesItemService {

	public void pageBalanceOalesItem(Paging paging, List<Filter> filters, long bsid);

	public List<BalanceOalesItemVO> queryBalanceOalesItem(BalanceOalesItemVO balanceOalesItem);

	public int countBalanceOalesItem(BalanceOalesVO balanceOales);

}

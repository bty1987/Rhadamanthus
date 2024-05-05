package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSelectionBO;
import com.fanglin.balance.po.BalanceSelectionPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSelectionDao extends Dao<BalanceSelectionPO> {

	public List<BalanceSelectionPO> pageBalanceSelection(Paging paging, List<Filter> filters, int company);

	public List<BalanceSelectionPO> queryBalanceSelection(String name, int company);

	public List<BalanceSelectionBO> pageBalanceSelectionForBalance(Paging paging, List<Filter> filters, int company);

	public long amountBalaceSelection(long bsid);
}

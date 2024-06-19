package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSelectionItemDao extends Dao<BalanceSelectionItemPO> {

	public List<BalanceSelectionItemPO> pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid);

	public List<BalanceSelectionItemPO> queryBalanceSelectionItem(long bsid);

	public BalanceSelectionItemPO queryBalanceSelectionItemBySiid(long siid);

	public int countBalanceSelectionItem(long bsid);

}

package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceOalesItemPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceOalesItemDao extends Dao<BalanceOalesItemPO> {

	public List<BalanceOalesItemPO> pageBalanceOalesItem(Paging paging, List<Filter> filters, long boid);

	public List<BalanceOalesItemPO> queryBalanceOalesItem(long boid);

	public int countBalanceOalesItem(long boid);

}

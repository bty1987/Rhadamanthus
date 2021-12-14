package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSalesBalanceDao extends Dao<BalanceSalesBalancePO> {

	public List<BalanceSalesBalancePO> pageBalanceSalesBalance(Paging paging, List<Filter> filters, long bsid);

	public List<BalanceSalesBalancePO> queryBalanceSalesBalance(long bsid);
	
	public int countBalanceSalesBalance(long bsid);

}

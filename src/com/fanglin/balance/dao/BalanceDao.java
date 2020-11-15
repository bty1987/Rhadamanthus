package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalancePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceDao extends Dao<BalancePO> {

	public List<BalancePO> pageBalance(Paging paging, List<Filter> filters, int company);

	public List<BalancePO> queryBalance(List<Filter> filters, int company);

	public BalancePO queryBalance(String no);
}

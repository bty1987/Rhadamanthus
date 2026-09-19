package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalancePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceDao extends Dao<BalancePO> {

	public List<BalancePO> pageBalance(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<BalancePO> queryBalance(List<Filter> filters, int company) throws FLException;

	public int updateBalanceForSurplus(long bid, long money);
}

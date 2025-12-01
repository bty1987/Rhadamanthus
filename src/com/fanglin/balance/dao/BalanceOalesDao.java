package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceOalesBO;
import com.fanglin.balance.po.BalanceOalesPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceOalesDao extends Dao<BalanceOalesPO> {

	public List<BalanceOalesPO> pageBalanceOales(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<BalanceOalesBO> pageBalanceOalesForBalance(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<BalanceOalesPO> queryBalanceOales(String name, int company);

	public long amountBalanceOales(long boid);
}

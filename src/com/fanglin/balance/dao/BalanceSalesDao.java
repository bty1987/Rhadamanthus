package com.fanglin.balance.dao;

import java.util.List;

import com.fanglin.balance.po.BalanceSalesBO;
import com.fanglin.balance.po.BalanceSalesPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BalanceSalesDao extends Dao<BalanceSalesPO> {

	public List<BalanceSalesBO> pageBalanceSales(Paging paging, List<Filter> filters, int company);

	public List<BalanceSalesBO> pageBalanceSalesForBalance(Paging paging, List<Filter> filters, Short status, int company);

	public List<BalanceSalesBO> pageBalanceSalesForSupplier(Paging paging, List<Filter> filters, String userId, int company);

	public List<BalanceSalesPO> queryBalanceSales(String name, int company);

	public BalanceSalesPO queryBalanceSales(long bid, int suid, String grade, short status, short atttype, int company);

	public Object[] amountBalanceSales(long bsid);
}

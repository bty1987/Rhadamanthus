package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesActivityPO;
import com.fanglin.utils.Paging;

public interface SalesActivityDao extends Dao<SalesActivityPO> {

	public List<SalesActivityPO> pageSalesActivity(Paging paging, List<Filter> filter, String orderId) throws FLException;

	public List<Object> querySalesActivityByTotal(String orderId);

	public long amountSalesActivityForPayment(String orderId);

	public long amountSalesActivityForActivity(String orderId);

}

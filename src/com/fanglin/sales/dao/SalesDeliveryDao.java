package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesDeliveryPO;
import com.fanglin.utils.Paging;

public interface SalesDeliveryDao extends Dao<SalesDeliveryPO> {

	public List<SalesDeliveryPO> pageSalesDelivery(Paging paging, List<Filter> filters, int company) throws FLException;

	public SalesDeliveryPO querySalesDelivery(long sid);

	public int countSalesDelivery(long sid);

}

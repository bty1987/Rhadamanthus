package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.utils.Paging;

public interface SalesDeliveryItemDao extends Dao<SalesDeliveryItemPO> {

	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company, int uid) throws FLException;

	public List<SalesDeliveryItemPO> pageSalesDeliveryItemForInstorer(Paging paging, List<Filter> filters, int company, int uid) throws FLException;

	public List<SalesDeliveryItemPO> querySalesDeliveryItem(long sid);

	public SalesDeliveryItemPO querySalesDeliveryItemBySiid(Long siid);

	public int countSalesDeliveryItem(long sid, short status);

}

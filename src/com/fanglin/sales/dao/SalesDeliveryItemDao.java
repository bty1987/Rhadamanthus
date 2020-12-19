package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.SalesDeliveryItemPO;
import com.fanglin.utils.Paging;

public interface SalesDeliveryItemDao extends Dao<SalesDeliveryItemPO> {

	public List<SalesDeliveryItemPO> pageSalesDeliveryItem(Paging paging, List<Filter> filters, int company);

	public List<SalesDeliveryItemPO> pageSalesDeliveryItemForSupplier(Paging paging, List<Filter> filters, int company, int uid);

	SalesDeliveryItemPO querySalesDeliveryItemBySiid(Long siid);

}

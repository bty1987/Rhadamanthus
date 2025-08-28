package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesActivityItemPO;

public interface SalesActivityItemDao extends Dao<SalesActivityItemPO> {

	public List<SalesActivityItemPO> querySalesActivityItem(String orderId);

	long amountSalesActivityItem(String orderId, Short type, List<Short> states);
	
}

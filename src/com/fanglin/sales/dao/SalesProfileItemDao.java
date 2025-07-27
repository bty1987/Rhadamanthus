package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesProfileItemPO;

public interface SalesProfileItemDao extends Dao<SalesProfileItemPO> {

	public List<SalesPO> querySalesByOrderId(String orderId);

}

package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CustomerChanceOrderPO;

public interface CustomerChanceOrderDao extends Dao<CustomerChanceOrderPO> {

	public CustomerChanceOrderPO queryCustomerChanceOrder(long ccid);

	public List<CustomerChanceOrderPO> queryCustomerChanceOrderByOrderId(String orderId);

}

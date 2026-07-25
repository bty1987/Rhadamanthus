package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerAfterSalesPO;
import com.fanglin.utils.Paging;

public interface CustomerAfterSalesDao extends Dao<CustomerAfterSalesPO> {

	public List<CustomerAfterSalesPO> pageCustomerAfterSales(Paging paging, List<Filter> filters, int company) throws FLException;

	public CustomerAfterSalesPO queryCustomerAfterSalesByAsNo(String asNo);

	public List<CustomerAfterSalesPO> queryCustomerAfterSalesByOrderId(String orderId, int company);

	public List<CustomerAfterSalesPO> queryCustomerAfterSalesByCid(long cid, int company);

}

package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerAfterSalesRecordVO;
import com.fanglin.customer.vo.CustomerAfterSalesRefVO;
import com.fanglin.customer.vo.CustomerAfterSalesVO;
import com.fanglin.utils.Paging;

public interface CustomerAfterSalesService {

	public void pageCustomerAfterSales(Paging paging, List<Filter> filters, int company) throws FLException;

	public CustomerAfterSalesVO queryCustomerAfterSalesByAsid(CustomerAfterSalesVO customerAfterSalesVO) throws FLException;

	public List<CustomerAfterSalesVO> queryCustomerAfterSalesByOrderId(CustomerAfterSalesVO customerAfterSalesVO, int company);

	public List<CustomerAfterSalesVO> queryCustomerAfterSalesByCid(CustomerAfterSalesVO customerAfterSalesVO, int company);

	public int addCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId, int company) throws FLException;

	public int receiveCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int dispatchCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int handleCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int tranCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int holdCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int upgradeCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int finishCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int closeCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int cancelCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public int reopenCustomerAfterSales(CustomerAfterSalesVO customerAfterSalesVO, String userId) throws FLException;

	public List<CustomerAfterSalesRecordVO> queryCustomerAfterSalesRecord(CustomerAfterSalesRecordVO customerAfterSalesRecordVO);

	public int addCustomerAfterSalesRecord(CustomerAfterSalesRecordVO customerAfterSalesRecordVO, String userId) throws FLException;

	public List<CustomerAfterSalesRefVO> queryCustomerAfterSalesRef(CustomerAfterSalesRefVO customerAfterSalesRefVO);

	public int addCustomerAfterSalesRef(CustomerAfterSalesRefVO customerAfterSalesRefVO) throws FLException;

}

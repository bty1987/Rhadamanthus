package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerFunctionVO;
import com.fanglin.utils.Paging;

public interface CustomerFunctionService {

	public List<CustomerFunctionVO> pageCustomerFunction(Paging paging, List<Filter> filters);

	public List<CustomerFunctionVO> queryCustomerFunction(CustomerFunctionVO customerFunction);

	public int addCustomerFunction(CustomerFunctionVO customerFunction) throws FLException;

	public int updateCustomerFunction(CustomerFunctionVO customerFunction) throws FLException;

	public int deleteCustomerFunction(CustomerFunctionVO customerFunction) throws FLException;

}

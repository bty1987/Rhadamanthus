package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.customer.vo.CustomerFunctionVO;

public interface CustomerFunctionService {

	public List<CustomerFunctionVO> queryCustomerFunction(CustomerFunctionVO customerFunction);

}

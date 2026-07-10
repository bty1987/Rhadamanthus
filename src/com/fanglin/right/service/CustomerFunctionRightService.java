package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.CustomerFunctionRightVO;

public interface CustomerFunctionRightService {
	
	public List<CustomerFunctionRightVO> queryCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRight, int company);

	public void updateCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRight, List<Long> cfids, int company);

}

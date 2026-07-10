package com.fanglin.right.service;

import java.util.List;

import com.fanglin.right.vo.CustomerOriginFunctionRightVO;

public interface CustomerOriginFunctionRightService {
	
	public List<CustomerOriginFunctionRightVO> queryCustomerOriginFunctionRight(CustomerOriginFunctionRightVO customerOriginFunctionRight, int company);

	public void updateCustomerOriginFunctionRight(CustomerOriginFunctionRightVO customerOriginFunctionRight, List<Long> cfids, int company);

}

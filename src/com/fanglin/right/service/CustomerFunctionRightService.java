package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.vo.CustomerFunctionRightVO;

public interface CustomerFunctionRightService {

	public List<CustomerFunctionRightVO> queryCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRight, int company);

	public void updateCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRight, List<Long> cfids, int company);

	public int syncCustomerFunctionRight(CustomerFunctionRightVO customerFunctionRight, List<String> companys, Integer company) throws FLException;

}

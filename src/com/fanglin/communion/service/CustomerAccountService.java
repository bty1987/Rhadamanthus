package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerAccountVO;
import com.fanglin.core.interceptor.FLException;

public interface CustomerAccountService {

	public List<CustomerAccountVO> queryCustomerAccount(CustomerAccountVO customerAccountVO);

	public CustomerAccountVO queryDefaultCustomerAccount(CustomerAccountVO customerAccountVO);

	public int addCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException;

	public int updateCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException;

	public int deleteCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException;

	public int setDefaultCustomerAccount(CustomerAccountVO customerAccountVO) throws FLException;

}

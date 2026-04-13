package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerBankVO;
import com.fanglin.core.interceptor.FLException;

public interface CustomerBankService {

	public List<CustomerBankVO> queryCustomerBank(CustomerBankVO customerBankVO);

	public CustomerBankVO queryDefaultCustomerBank(CustomerBankVO customerBankVO);

	public int addCustomerBank(CustomerBankVO customerBankVO) throws FLException;

	public int updateCustomerBank(CustomerBankVO customerBankVO) throws FLException;

	public int deleteCustomerBank(CustomerBankVO customerBankVO) throws FLException;

	public int setDefaultCustomerBank(CustomerBankVO customerBankVO) throws FLException;

}

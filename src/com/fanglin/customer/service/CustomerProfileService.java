package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerProfileVO;
import com.fanglin.utils.Paging;

public interface CustomerProfileService {

	public void pageCustomerProfile(Paging paging, List<Filter> filters, int company);

	public List<CustomerProfileVO> queryCustomerProfileByCsid(CustomerProfileVO customerProfileVO) throws FLException;

	public List<CustomerProfileVO> queryCustomerProfileByCid(CustomerProfileVO customerProfileVO) throws FLException;

	public List<CustomerProfileVO> queryCustomerProfileByOrderId(CustomerProfileVO customerProfileVO) throws FLException;

	public CustomerProfileVO queryCustomerProfileByCpid(CustomerProfileVO customerProfileVO) throws FLException;

	public int addCustomerProfile(CustomerProfileVO customerProfileVO, String userId, int company) throws FLException;

	public int makeCustomerProfile(CustomerProfileVO customerProfileVO, String userId, int company) throws FLException;

	public void handleCustomerProfile(CustomerProfileVO customerProfileVO) throws FLException;

}

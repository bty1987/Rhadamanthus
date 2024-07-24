package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.utils.Paging;

public interface CustomerSourceService {

	public void pageCustomerSource(Paging paging, List<Filter> filters, CustomerSourceVO customerSourceVO);

	public CustomerSourceVO queryCustomerSource(CustomerSourceVO customerSourceVO) throws FLException;

	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId) throws FLException;

	public void updateCustomerSource(CustomerSourceVO customerSourceVO) throws FLException;

	public void updateCustomerSourceForAdvance(CustomerSourceVO customerSourceVO) throws FLException;

	public void updateCustomerSourceForStatus(CustomerSourceVO customerSourceVO) throws FLException;

	public void issueCustomerSource(CustomerSourceVO customerSourceVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException;

}

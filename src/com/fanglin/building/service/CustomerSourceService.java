package com.fanglin.building.service;

import java.util.List;

import com.fanglin.building.vo.CustomerSourceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface CustomerSourceService {

	public void pageCustomerSource(Paging paging, List<Filter> filters, String userId);
	
	public CustomerSourceVO queryCustomerSourceByCsid(CustomerSourceVO customerSource);
	
	public CustomerSourceVO queryCustomerSourceByNo(CustomerSourceVO customerSource) throws FLException;
	
	public CustomerSourceVO checkCustomerSource(CustomerSourceVO customerSource) throws FLException;

	public void addCustomerSource(CustomerSourceVO customerSource, String userId, int company) throws FLException;

	public void updateCustomerSource(CustomerSourceVO customerSource) throws FLException;

	public void updateCustomerSourceForStatus(CustomerSourceVO customerSource) throws FLException;

}

package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.utils.Paging;

public interface CustomerOriginService {

	public void pageCustomerOrigin(Paging paging, List<Filter> filters, String UserId); 

	public void pageCustomerOriginForAdvance(Paging paging, List<Filter> filters, String userId);
	
	public void pageCustomerOriginForCommunion(Paging paging, List<Filter> filters); 
	
	public void addCustomerOrigin(CustomerOriginVO customerOriginVO, String userId);

	public void updateCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException; 

	public void updateCustomerOriginForBelonger(CustomerOriginVO customerOriginVO, String userId) throws FLException;

	public void freeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;
	
	public void takeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException;
}

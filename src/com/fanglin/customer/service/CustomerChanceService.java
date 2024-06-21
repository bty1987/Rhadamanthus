package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.utils.Paging;

public interface CustomerChanceService {

	public void pageCustomerChance(Paging paging, List<Filter> filters, String userId);

	public void disableCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void sendCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void confirmCustomerChange(CustomerChanceVO customerChance, String securityCode, String verifyCode) throws FLException;

	public void issueCustomerChance(CustomerChanceVO customerChangeVO, String userId) throws FLException;

}

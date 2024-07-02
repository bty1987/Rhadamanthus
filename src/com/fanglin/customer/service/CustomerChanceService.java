package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface CustomerChanceService {

	public void pageCustomerChance(Paging paging, List<Filter> filters, CustomerChanceVO customerChanceVO, String userId);

	public List<CustomerChanceVO> queryCustomerChance(CustomerChanceVO customerChanceVO) throws FLException;

	public void disableCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void sendCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void confirmCustomerChange(CustomerChanceVO customerChance, String securityCode, String verifyCode) throws FLException;

	public void issueCustomerChance(CustomerChanceVO customerChangeVO, String userId) throws FLException;

	public void changeCustomerChance(DecorationVO decorationVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException;

}

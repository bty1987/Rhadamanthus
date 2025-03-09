package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface CustomerChanceService {

	public void pageCustomerChance(Paging paging, List<Filter> filters, CustomerChanceVO customerChanceVO, String userId, Integer company);

	public List<CustomerChanceVO> queryCustomerChance(CustomerChanceVO customerChanceVO) throws FLException;

	public CustomerChanceVO queryCustomerChanceByCcid(CustomerChanceVO customerChanceVO) throws FLException;

	public void updateCustomerChance(CustomerChanceVO customerChanceVO) throws FLException;

	public void disableCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void sendCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;

	public void confirmCustomerChance(CustomerChanceVO customerChance, String securityCode, String verifyCode) throws FLException;

	public void issueCustomerChance(CustomerChanceVO customerChangeVO, String userId) throws FLException;

	public void changeCustomerChance(DecorationVO decorationVO, CustomerChanceVO customerChanceVO, String userId, int company) throws FLException;

	public void readCustomerChance(CustomerChanceVO customerChangeVO) throws FLException;

	public void configCustomerChance(CustomerChanceVO customerChance) throws FLException;

	public void fineCustomerChance(CustomerChanceVO customerChance, String userId) throws FLException;
}

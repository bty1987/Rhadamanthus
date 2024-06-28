package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;

public interface CustomerUserRuleItemService {

	public List<CustomerUserRuleItemVO> queryCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO);

	public void addCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException;

	public void deleteCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException;

}

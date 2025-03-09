package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerProtectRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerProtectRuleService {

	public void pageCustomerProtectRule(Paging paging, List<Filter> filters, int company);

	public List<CustomerProtectRuleVO> queryCustomerProtectRule(CustomerProtectRuleVO customerProtectRule);

	public void addCustomerProtectRule(CustomerProtectRuleVO customerProtectRule, String userId, int company) throws FLException;

	public void deleteCustomerProtectRule(CustomerProtectRuleVO customerProtectRule) throws FLException;

}

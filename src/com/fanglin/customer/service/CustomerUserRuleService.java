package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerUserRuleService {

	public void pageCustomerUserRule(Paging paging, List<Filter> filters, int company);

	public void addCustomerUserRule(CustomerUserRuleVO customerUserRule, String userId, int company);

	public void updateCustomerUserRule(CustomerUserRuleVO customerUserRule) throws FLException;

	public void updateCustomerUserRuleForStatus(CustomerUserRuleVO customerUserRule) throws FLException;

}

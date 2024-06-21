package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerDeptRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerDeptRuleService {

	public void pageCustomerDeptRule(Paging paging, List<Filter> filters) throws FLException;

	public CustomerDeptRuleVO queryCustomerDeptRule(CustomerDeptRuleVO customerDeptRule) throws FLException;

	public void addCustomerDeptRule(CustomerDeptRuleVO customerDeptRuleVO, String userId) throws FLException;

	public void deleteCustomerDeptRule(CustomerDeptRuleVO customerDeptRule) throws FLException;

}

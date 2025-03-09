package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerCompanyRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerCompanyRuleService {

	public void pageCustomerCompanyRule(Paging paging, List<Filter> filters, int cid) throws FLException;

	public List<CustomerCompanyRuleVO> queryCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule, int cid) throws FLException;

	public void addCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule, String userId, int company) throws FLException;

	public void deleteCustomerCompanyRule(CustomerCompanyRuleVO customerCompanyRule) throws FLException;

}

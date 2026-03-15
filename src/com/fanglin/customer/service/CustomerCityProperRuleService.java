package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerCityProperRuleVO;
import com.fanglin.utils.Paging;

public interface CustomerCityProperRuleService {

	/**
	 * 分页查询城区规则
	 */
	public void pageCustomerCityProperRule(Paging paging, List<Filter> filters, int company) throws FLException;

	/**
	 * 根据条件查询城区规则
	 */
	public List<CustomerCityProperRuleVO> queryCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO, int company) throws FLException;

	/**
	 * 添加城区规则
	 */
	public void addCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO, String userId, int company) throws FLException;

	/**
	 * 删除城区规则
	 */
	public void deleteCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO) throws FLException;

	/**
	 * 更新城区规则
	 */
	public void updateCustomerCityProperRule(CustomerCityProperRuleVO customerCityProperRuleVO) throws FLException;
}

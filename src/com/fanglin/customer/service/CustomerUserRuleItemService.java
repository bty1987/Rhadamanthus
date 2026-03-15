package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;

public interface CustomerUserRuleItemService {

	public List<CustomerUserRuleItemVO> queryCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO);

	public void addCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException;

	public void deleteCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItemVO) throws FLException;

	/**
	 * 通过用户拼音查询客户规则项
	 * @param pinyinName 用户拼音
	 * @return 客户规则项列表（包含用户信息）
	 */
	public List<CustomerUserRuleItemVO> queryCustomerUserRuleItemByPinyin(String pinyinName);

}

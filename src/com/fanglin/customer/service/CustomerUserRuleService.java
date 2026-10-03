package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface CustomerUserRuleService {

	public void pageCustomerUserRule(Paging paging, List<Filter> filters, CustomerUserRuleVO customerUserRule, int company);

	public CustomerUserRuleVO queryCustomerUserRule(CustomerUserRuleVO customerUserRule) throws FLException;

	public List<UserBaseVO> queryCustomerUserRuleByPinyin(String pinyinName, UserVO userVO, DepartmentTypeVO departmentType, Integer company) throws FLException;

	public void addCustomerUserRule(CustomerUserRuleVO customerUserRule, String userId, int company) throws FLException;

	public void updateCustomerUserRule(CustomerUserRuleVO customerUserRule, String userId) throws FLException;

	public void updateCustomerUserRuleForStatus(CustomerUserRuleVO customerUserRule, String userId) throws FLException;

	public void disableCustomerUserRule(int company);

	public void disableCustomerUserRuleByCurid(CustomerUserRuleVO customerUserRule) throws FLException;

}

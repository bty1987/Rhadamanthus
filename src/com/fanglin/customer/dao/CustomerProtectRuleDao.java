package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerProtectRulePO;
import com.fanglin.utils.Paging;

public interface CustomerProtectRuleDao extends Dao<CustomerProtectRulePO> {

	public List<CustomerProtectRulePO> pageCustomerProtectRule(Paging paging, List<Filter> filters, int company);

	public List<CustomerProtectRulePO> queryCustomerProtectRule(Short type, Integer uppval, Integer lowval, Integer days);

	public List<CustomerProtectRulePO> queryCustomerProtectRule(Short type, int uppval, int lowval);

	public CustomerProtectRulePO queryCustomerProtectRule(Short type, int value);

	/**
	 * 根据岗位查询保护规则
	 * 
	 * @param did 岗位ID
	 * @param company 公司ID
	 * @return 规则列表
	 */
	public List<CustomerProtectRulePO> queryCustomerProtectRuleByDuty(Long did, int company);

}

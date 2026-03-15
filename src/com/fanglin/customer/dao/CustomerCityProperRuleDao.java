package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.CustomerCityProperRulePO;
import com.fanglin.utils.Paging;

public interface CustomerCityProperRuleDao extends Dao<CustomerCityProperRulePO> {

	/**
	 * 分页查询城区规则
	 */
	public void pageCustomerCityProperRule(Paging paging, List<Filter> filters, int company);

	/**
	 * 根据城区查询规则
	 */
	public List<CustomerCityProperRulePO> queryCustomerCityProperRule(Integer cpid, int company);

	/**
	 * 根据城区和规则类型查询
	 *
	 * @param cpid 城区ID
	 * @param company 公司ID
	 * @param type 规则类型（0=公司, 1=部门, 2=设计师）
	 * @return 城区规则列表
	 */
	public List<CustomerCityProperRulePO> queryCustomerCityProperRuleByType(Integer cpid, int company, short type);

	/**
	 * 查询所有启用的城区规则
	 */
	public List<CustomerCityProperRulePO> queryCustomerCityProperRule(int company);
}

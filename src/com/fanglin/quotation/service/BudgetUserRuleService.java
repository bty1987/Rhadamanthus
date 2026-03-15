package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.BudgetUserRuleVO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则服务接口
 * 提供预算员的 CRUD、类型管理、状态更新等功能
 */
public interface BudgetUserRuleService {

	/**
	 * 分页查询预算员规则列表
	 * @param paging 分页参数
	 * @param filters 过滤条件
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> pageBudgetUserRule(Paging paging, List<Filter> filters);

	/**
	 * 根据 ID 查询预算员规则
	 * @param burid 预算员规则ID
	 * @return 预算员规则
	 */
	BudgetUserRuleVO getBudgetUserRule(Integer burid);

	/**
	 * 根据用户ID查询预算员规则
	 * @param uid 用户ID
	 * @return 预算员规则
	 */
	BudgetUserRuleVO getBudgetUserRuleByUid(Integer uid);

	/**
	 * 保存预算员规则（新增或更新）
	 * @param budgetUserRule 预算员规则
	 */
	void saveBudgetUserRule(BudgetUserRuleVO budgetUserRule);

	/**
	 * 更新预算员规则
	 * @param budgetUserRule 预算员规则
	 */
	void updateBudgetUserRule(BudgetUserRuleVO budgetUserRule);

	/**
	 * 删除预算员规则
	 * @param burid 预算员规则ID
	 */
	void deleteBudgetUserRule(Integer burid);

	/**
	 * 保存预算员支持的类型列表
	 * 会先删除该预算员的所有类型配置，再插入新的类型配置
	 * @param burid 预算员规则ID
	 * @param types 类型列表（1-半包，2-整装）
	 */
	void saveBudgetUserRuleTypes(Integer burid, List<Byte> types);

	/**
	 * 更新预算员状态
	 * 基于 quotationassignrequest 统计任务数量，自动更新状态
	 * @param uid 用户ID
	 */
	void updateBudgetUserStatus(Integer uid);

	/**
	 * 停用预算员
	 * @param burid 预算员规则ID
	 */
	void disableBudgetUserRule(Integer burid);

	/**
	 * 启用预算员
	 * @param burid 预算员规则ID
	 */
	void enableBudgetUserRule(Integer burid);

	/**
	 * 查询公司的所有预算员
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> getBudgetUsersByCompany(Integer company);

	/**
	 * 查询待分配的预算员列表
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> getAvailableBudgetUsers(Integer company, Integer department);
}

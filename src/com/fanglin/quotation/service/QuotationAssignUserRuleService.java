package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.BudgetUserRuleVO;

/**
 * 报价单预算员规则表 Service 接口
 * 职责: 管理预算员的分配规则（状态、任务数、完成时间等）
 */
public interface QuotationAssignUserRuleService {

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 * @param budgetUserRule 预算员规则VO（包含uid和company）
	 * @return 预算员规则VO
	 */
	BudgetUserRuleVO queryQuotationAssignUserRuleByUidAndCompany(BudgetUserRuleVO budgetUserRule);

	/**
	 * 查询待分配且完成时间最早的预算员列表
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> pullQuotationAssignUserRule(int company, Integer department);

	/**
	 * 根据用户ID查询预算员规则
	 * @param budgetUserRule 预算员规则VO（包含uid）
	 * @return 预算员规则VO
	 */
	BudgetUserRuleVO queryQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule);

	/**
	 * 查询公司的所有预算员
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> queryQuotationAssignUserRuleByCompany(int company);

	/**
	 * 查询指定部门的预算员列表
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> queryQuotationAssignUserRuleByDepartment(int company, int department);

	/**
	 * 查询可用的预算员列表（状态为待分配）
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<BudgetUserRuleVO> pullAvailableQuotationAssignUserRule(int company, Integer department);

	/**
	 * 更新预算员状态和任务数量
	 * @param budgetUserRule 预算员规则VO（包含uid、status、currentTaskCount）
	 * @throws FLException
	 */
	void updateStatusAndTaskCount(BudgetUserRuleVO budgetUserRule) throws FLException;

	/**
	 * 统计预算员的当前任务数（基于 quotationassignrequest）
	 * @param budgetUserRule 预算员规则VO（包含uid）
	 * @return 任务数量
	 */
	int countQuotationAssignTaskByUid(BudgetUserRuleVO budgetUserRule);

	/**
	 * 统计公司的预算员数量
	 * @param company 公司ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByCompany(int company);

	/**
	 * 统计指定部门的预算员数量
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByDepartment(int company, int department);

	/**
	 * 检查用户是否为预算员
	 * @param budgetUserRule 预算员规则VO（包含uid和company）
	 * @return 数量（0表示不是，>0表示是）
	 */
	int existQuotationAssignUserRule(BudgetUserRuleVO budgetUserRule);

	/**
	 * 禁用预算员（设置状态为停止）
	 * @param budgetUserRule 预算员规则VO（包含uid）
	 * @throws FLException
	 */
	void disableQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule) throws FLException;

	/**
	 * 启用预算员（设置状态为待分配）
	 * @param budgetUserRule 预算员规则VO（包含uid）
	 * @throws FLException
	 */
	void enableQuotationAssignUserRuleByUid(BudgetUserRuleVO budgetUserRule) throws FLException;

	/**
	 * 添加预算员规则
	 * @param budgetUserRule 预算员规则VO
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void addQuotationAssignUserRule(BudgetUserRuleVO budgetUserRule, String userId) throws FLException;

	/**
	 * 更新预算员规则
	 * @param budgetUserRule 预算员规则VO
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void updateQuotationAssignUserRule(BudgetUserRuleVO budgetUserRule, String userId) throws FLException;
}

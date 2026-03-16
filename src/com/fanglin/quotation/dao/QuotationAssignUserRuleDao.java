package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;

/**
 * 报价单预算员规则表 DAO 接口 职责: 管理预算员的分配规则（状态、任务数、完成时间等）
 */
public interface QuotationAssignUserRuleDao extends Dao<QuotationAssignUserRulePO> {

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 * 
	 * @param uid 用户ID
	 * @param company 公司ID
	 * @return 预算员规则
	 */
	QuotationAssignUserRulePO queryQuotationAssignUserRuleByUid(int uid, int company);

	/**
	 * 查询公司的所有预算员
	 * 
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRulePO> queryQuotationAssignUserRule(int company);

	/**
	 * 查询指定部门的预算员列表
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRulePO> queryQuotationAssignUserRuleByDid(int company, int department);

	/**
	 * 根据用户ID查询预算员规则
	 * 
	 * @param uid 用户ID
	 * @return 预算员规则
	 */
	QuotationAssignUserRulePO queryQuotationAssignUserRuleByUid(int uid);

	/**
	 * 查询待分配且完成时间最早的预算员列表
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRulePO> pullQuotationAssignUserRuleforQueue(int company, Integer department);

	/**
	 * 查询可用的预算员列表（状态为待分配）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRulePO> pullQuotationAssignUserRuleForPending(int company, Integer department);

	/**
	 * 更新预算员状态和任务数量
	 * 
	 * @param uid 用户ID
	 * @param status 状态
	 * @param taskCount 任务数量
	 * @return 影响行数
	 */
	int updateQuotationAssignUserRule(int uid, short status, int taskCount);

	/**
	 * 统计预算员的当前任务数（基于 quotationassignrequest）
	 * 
	 * @param uid 用户ID
	 * @return 任务数量
	 */
	int countQuotationAssignUserRuleByUid(int uid);

	/**
	 * 统计公司的预算员数量
	 * 
	 * @param company 公司ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByCompany(int company);

	/**
	 * 统计指定部门的预算员数量
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByDid(int company, int department);

	/**
	 * 检查用户是否为预算员
	 * 
	 * @param uid 用户ID
	 * @param company 公司ID
	 * @return 数量（0表示不是，>0表示是）
	 */
	int existQuotationAssignUserRule(int uid, int company);

	/**
	 * 禁用预算员（设置状态为停止）
	 * 
	 * @param uid 用户ID
	 * @return 影响行数
	 */
	int disableQuotationAssignUserRule(int uid);

	/**
	 * 启用预算员（设置状态为待分配）
	 *
	 * @param uid 用户ID
	 * @return 影响行数
	 */
	int enableQuotationAssignUserRule(int uid);

	/**
	 * 分页查询预算员规则
	 *
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(com.fanglin.utils.Paging paging, List<com.fanglin.core.vo.Filter> filters, int company);
}

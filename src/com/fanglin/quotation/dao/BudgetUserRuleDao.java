package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.BudgetUserRulePO;

/**
 * 预算员规则表 DAO 接口
 */
public interface BudgetUserRuleDao extends Dao<BudgetUserRulePO> {

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 * @param uid 用户ID
	 * @param company 公司ID
	 * @return 预算员规则
	 */
	BudgetUserRulePO findByUidAndCompany(Integer uid, Integer company);

	/**
	 * 查询待分配且完成时间最早的预算员列表
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<BudgetUserRulePO> findAvailableBudgetUsers(Integer company, Integer department);

	/**
	 * 根据用户ID查询预算员规则
	 * @param uid 用户ID
	 * @return 预算员规则
	 */
	BudgetUserRulePO findByUid(Integer uid);

	/**
	 * 查询公司的所有预算员
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<BudgetUserRulePO> findByCompany(Integer company);

	/**
	 * 更新预算员状态和任务数量
	 * @param uid 用户ID
	 * @param status 状态
	 * @param taskCount 任务数量
	 * @return 影响行数
	 */
	int updateStatusAndTaskCount(Integer uid, Byte status, Integer taskCount);

	/**
	 * 统计预算员的当前任务数（基于 quotationassignrequest）
	 * @param uid 用户ID
	 * @return 任务数量
	 */
	int countTasksByUid(Integer uid);
}

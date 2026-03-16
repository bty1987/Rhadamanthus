package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;

/**
 * 装修单预算分配服务接口 职责: 实现自动分配、手动分配、反向自动分配等核心逻辑
 */
public interface QuotationAssignService {

	/**
	 * 自动分配预算员（含类型匹配）
	 * 
	 * @param orderId 装修单号
	 * @param companyId 公司ID
	 * @param decorationType 装修类型（1-半包，2-整装）
	 * @return 分配的预算员用户ID，失败返回null
	 */
	Integer autoAssignBudgetUser(String orderId, Integer companyId, Byte decorationType);

	/**
	 * 手动分配预算员
	 * 
	 * @param orderId 装修单号
	 * @param budgetUid 预算员用户ID
	 * @param assignUid 分配人用户ID（手动分配时）
	 * @return 是否成功
	 * @throws FLException
	 */
	boolean manualAssignBudgetUser(String orderId, Integer budgetUid, Integer assignUid) throws FLException;

	/**
	 * 完成报价单，触发反向自动分配
	 * 
	 * @param orderId 装修单号
	 */
	void finishQuotation(String orderId);

	/**
	 * 重新分配预算员
	 * 
	 * @param orderId 装修单号
	 * @param newBudgetUid 新预算员用户ID
	 * @param assignUid 分配人用户ID
	 * @return 是否成功
	 * @throws FLException
	 */
	boolean reassignBudgetUser(String orderId, Integer newBudgetUid, Integer assignUid) throws FLException;

	/**
	 * 检查是否启用预算分配功能
	 * 
	 * @param companyId 公司ID
	 * @param departmentId 部门ID
	 * @return 是否启用
	 */
	boolean isQuotationAssignEnabled(Integer companyId, Integer departmentId);

	/**
	 * 检查是否自动分配模式
	 * 
	 * @param companyId 公司ID
	 * @param departmentId 部门ID
	 * @return 是否自动分配
	 */
	boolean isAutoAssign(Integer companyId, Integer departmentId);

	/**
	 * 更新预算员状态（基于 quotationassignrequest 统计）
	 * 
	 * @param uid 预算员用户ID
	 */
	void updateBudgetUserStatus(Integer uid);
}

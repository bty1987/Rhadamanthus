package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationAssignVO;

/**
 * 装修单预算分配服务接口 职责: 实现自动分配、手动分配、反向自动分配等核心逻辑
 */
public interface QuotationAssignService {

	/**
	 * 自动分配预算员（含类型匹配）
	 * 
	 * @param quotationAssign 分配参数VO（包含orderId、companyId、decorationType）
	 * @return 分配的预算员用户ID，失败返回null
	 * @throws FLException
	 */
	Integer assignQuotationAssign(QuotationAssignVO quotationAssign, Integer company) throws FLException;

	/**
	 * 手动分配预算员
	 * 
	 * @param quotationAssign 分配参数VO（包含orderId、budgetUid、assignUid）
	 * @return 是否成功
	 * @throws FLException
	 */
	boolean manualQuotationAssign(QuotationAssignVO quotationAssign) throws FLException;

	/**
	 * 完成报价单，触发反向自动分配
	 * 
	 * @param quotationAssign 分配参数VO（包含orderId）
	 */
	void finishQuotationAssign(QuotationAssignVO quotationAssign);

	/**
	 * 重新分配预算员
	 * 
	 * @param quotationAssign 分配参数VO（包含orderId、newBudgetUid、assignUid）
	 * @return 是否成功
	 * @throws FLException
	 */
	boolean reassignQuotationAssign(QuotationAssignVO quotationAssign) throws FLException;

	/**
	 * 检查是否启用预算分配功能
	 * 
	 * @param quotationAssign 分配参数VO（包含companyId、department）
	 * @return 是否启用
	 */
	boolean isQuotationAssignEnabled(QuotationAssignVO quotationAssign);

	/**
	 * 检查是否自动分配模式
	 * 
	 * @param quotationAssign 分配参数VO（包含companyId、department）
	 * @return 是否自动分配
	 */
	boolean isAutoAssign(QuotationAssignVO quotationAssign);

	/**
	 * 更新预算员状态（基于 quotationassignrequest 统计）
	 * 
	 * @param quotationAssign 分配参数VO（包含budgetUid）
	 */
	void updateBudgetUserStatus(QuotationAssignVO quotationAssign);
}

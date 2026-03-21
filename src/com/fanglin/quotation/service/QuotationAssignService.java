/**
 * @File Name     : QuotationAssignService.java
 * @Package      : com.fanglin.quotation.service
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 核心分配逻辑 Service 接口
 */

package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationAssignVO;

/**
 * 核心分配逻辑 Service 接口
 * 
 * <p>
 * 职责：实现报价员预算员的自动分配与手动派单功能
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>正向自动分配（设计师发起）</li>
 * <li>反向自动分配（预算员完成后）</li>
 * <li>手动分配（预算经理派单）</li>
 * <li>重新分配（更换预算员）</li>
 * </ul>
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignService {

	/**
	 * 正向自动分配（设计师发起）
	 * 
	 * <p>
	 * 分配逻辑：
	 * </p>
	 * <ol>
	 * <li>检查装修单是否已分配报价员</li>
	 * <li>查找状态为"待分配"的预算员（按lastFinishTime升序、currentTaskCount升序）</li>
	 * <li>验证预算员是否支持该装修类型（supportedType字段）</li>
	 * <li>如果找到：更新装修单报价员、更新request状态、生成分配记录</li>
	 * <li>如果未找到：创建待分配请求</li>
	 * </ol>
	 * 
	 * @param quotationAssignVO 分配参数VO（包含orderId）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	int autoQuotationAssign(QuotationAssignVO quotationAssignVO) throws FLException;

	/**
	 * 手动分配报价员（预算经理派单）
	 * 
	 * @param quotationAssignVO 分配参数VO（包含orderId、budgetUid、assignUid）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	int manualQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException;

	/**
	 * 重新分配报价员（更换预算员）
	 * 
	 * @param quotationAssignVO 分配参数VO（包含orderId、newBudgetUid、assignUid）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	int reassignQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException;

	/**
	 * 完成报价单后触发反向自动分配（内部方法）
	 * 
	 * <p>
	 * 分配逻辑：
	 * </p>
	 * <ol>
	 * <li>更新预算员的lastFinishTime</li>
	 * <li>从待分配队列中查找类型匹配的任务</li>
	 * <li>如果找到：自动分配给该预算员</li>
	 * </ol>
	 * 
	 * @param quotationAssignVO 分配参数VO（包含orderId）
	 * @return 影响行数
	 * @throws FLException 业务异常
	 */
	int finishQuotationAssign(QuotationAssignVO quotationAssignVO) throws FLException;
}

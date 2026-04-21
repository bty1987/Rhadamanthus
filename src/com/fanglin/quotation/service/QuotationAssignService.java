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

	/**
	 * 转交报价员（预算员将任务转交给其他预算员）
	 * 
	 * <p>
	 * 业务规则：
	 * </p>
	 * <ul>
	 * <li>只有已分配状态(status=2)的分配请求才能转交</li>
	 * <li>更新分配队列中的预算员 uid</li>
	 * <li>更新装修单中的预算员 quoter</li>
	 * <li>报价单不需要变更</li>
	 * <li>记录转交操作日志到分配记录表</li>
	 * </ul>
	 * 
	 * @param quotationAssignVO 包含 orderId 和新预算员 quoter.userId
	 * @param userId 当前操作人（转出预算员）的 userId
	 * @return 1=成功
	 * @throws FLException 业务异常
	 */
	int transferQuotationAssign(QuotationAssignVO quotationAssignVO, String userId) throws FLException;
}

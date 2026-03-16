package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配请求表 DAO 接口 职责: 控制分配逻辑和待分配队列（装修单级别，最多1条活跃记录）
 */
public interface QuotationAssignRequestDao extends Dao<QuotationAssignRequestPO> {

	/**
	 * 根据装修单号查询待分配或已分配请求
	 * 
	 * @param orderId 装修单号
	 * @return 分配请求
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestByOrderId(String orderId);

	/**
	 * 根据装修单号和状态查询请求
	 * 
	 * @param orderId 装修单号
	 * @param status 状态
	 * @return 分配请求
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestByOrderIdAndStatus(String orderId, short status);

	/**
	 * 查询待分配队列中最优先的任务
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 分配请求
	 */
	QuotationAssignRequestPO pullTopPriorityQuotationAssignRequest(int company, Integer department);

	/**
	 * 查询待分配队列中最优先且类型匹配的任务
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param supportedTypes 支持的类型列表（如：[1,2]）
	 * @return 分配请求
	 */
	QuotationAssignRequestPO pullTopPriorityQuotationAssignRequestByTypes(int company, Integer department, List<Short> supportedTypes);

	/**
	 * 查询公司的待分配队列
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 分配请求列表
	 */
	List<QuotationAssignRequestPO> queryPendingQuotationAssignRequestQueue(int company, Integer department);

	/**
	 * 统计待分配队列数量
	 * 
	 * @param company 公司ID
	 * @return 数量
	 */
	int countPendingQuotationAssignRequestQueue(int company);

	/**
	 * 统计指定部门的待分配队列数量
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量
	 */
	int countPendingQuotationAssignRequestQueueByDepartment(int company, int department);

	/**
	 * 获取队列位置
	 * 
	 * @param company 公司ID
	 * @param requestTime 请求时间
	 * @return 位置（从1开始）
	 */
	int getQuotationAssignRequestQueuePosition(int company, java.sql.Timestamp requestTime);

	/**
	 * 更新分配请求状态
	 * 
	 * @param qarid 请求ID
	 * @param status 新状态
	 * @return 影响行数
	 */
	int updateQuotationAssignRequestStatus(long qarid, short status);

	/**
	 * 批量更新过期请求的状态
	 * 
	 * @param company 公司ID
	 * @param beforeTime 在此时间之前的请求
	 * @param oldStatus 旧状态
	 * @param newStatus 新状态
	 * @return 影响行数
	 */
	int batchUpdateExpiredQuotationAssignRequestStatus(int company, java.sql.Timestamp beforeTime, short oldStatus, short newStatus);

	/**
	 * 检查装修单是否在待分配队列中
	 * 
	 * @param orderId 装修单号
	 * @param status 状态
	 * @return 数量（0表示不在，>0表示在）
	 */
	int existQuotationAssignRequestInQueue(String orderId, short status);

	/**
	 * 删除指定状态的分配请求
	 * 
	 * @param orderId 装修单号
	 * @param status 状态
	 * @return 影响行数
	 */
	int deleteQuotationAssignRequestByOrderIdAndStatus(String orderId, short status);

	List<QuotationAssignRequestPO> page(Paging paging, List<Filter> filters);
}

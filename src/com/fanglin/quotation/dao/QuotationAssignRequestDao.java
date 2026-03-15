package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignRequestPO;

/**
 * 装修单预算分配请求表 DAO 接口
 */
public interface QuotationAssignRequestDao extends Dao<QuotationAssignRequestPO> {

	/**
	 * 根据装修单号查询待分配或已分配请求
	 * @param orderId 装修单号
	 * @return 分配请求
	 */
	QuotationAssignRequestPO findByOrderId(String orderId);

	/**
	 * 查询待分配队列中最优先的任务
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 分配请求
	 */
	QuotationAssignRequestPO findTopPriorityRequest(Integer company, Integer department);

	/**
	 * 查询待分配队列中最优先且类型匹配的任务
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param supportedTypes 支持的类型列表（如：[1,2]）
	 * @return 分配请求
	 */
	QuotationAssignRequestPO findTopPriorityRequestByTypes(Integer company, Integer department, List<Byte> supportedTypes);

	/**
	 * 查询公司的待分配队列
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 分配请求列表
	 */
	List<QuotationAssignRequestPO> findPendingQueue(Integer company, Integer department);

	/**
	 * 统计待分配队列数量
	 * @param company 公司ID
	 * @return 数量
	 */
	int countPendingQueue(Integer company);

	/**
	 * 获取队列位置
	 * @param company 公司ID
	 * @param requestTime 请求时间
	 * @return 位置（从1开始）
	 */
	int getQueuePosition(Integer company, java.sql.Timestamp requestTime);
}

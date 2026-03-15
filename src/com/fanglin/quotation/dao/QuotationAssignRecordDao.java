package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;

/**
 * 装修单预算分配记录表 DAO 接口
 * 职责: 追溯所有分配尝试（成功、失败、重新分配）
 */
public interface QuotationAssignRecordDao extends Dao<QuotationAssignRecordPO> {

	/**
	 * 查询装修单的所有分配记录
	 * @param orderId 装修单号
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderId(String orderId);

	/**
	 * 查询预算员的所有分配记录
	 * @param uid 预算员用户ID
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecordByUid(int uid);

	/**
	 * 查询装修单的最近分配记录
	 * @param orderId 装修单号
	 * @param limit 限制数量
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryRecentQuotationAssignRecordByOrderId(String orderId, int limit);

	/**
	 * 统计预算员的成功分配次数
	 * @param uid 预算员用户ID
	 * @return 成功次数
	 */
	int countSuccessQuotationAssignRecordByUid(int uid);

	/**
	 * 统计预算员的失败分配次数
	 * @param uid 预算员用户ID
	 * @return 失败次数
	 */
	int countFailQuotationAssignRecordByUid(int uid);

	/**
	 * 查询预算员最后一次成功分配记录
	 * @param uid 预算员用户ID
	 * @return 分配记录
	 */
	QuotationAssignRecordPO queryLastSuccessQuotationAssignRecordByUid(int uid);

	/**
	 * 查询预算员最后一次分配记录（无论成功失败）
	 * @param uid 预算员用户ID
	 * @return 分配记录
	 */
	QuotationAssignRecordPO queryLastQuotationAssignRecordByUid(int uid);

	/**
	 * 查询指定装修单和预算员的分配记录
	 * @param orderId 装修单号
	 * @param uid 预算员用户ID
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderIdAndUid(String orderId, int uid);

	/**
	 * 统计指定时间范围内的分配记录数
	 * @param uid 预算员用户ID
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 * @return 记录数
	 */
	int countQuotationAssignRecordByUidAndTimeRange(int uid, java.sql.Timestamp startTime, java.sql.Timestamp endTime);

	/**
	 * 查询指定装修单的成功分配记录
	 * @param orderId 装修单号
	 * @return 分配记录
	 */
	QuotationAssignRecordPO querySuccessQuotationAssignRecordByOrderId(String orderId);

	/**
	 * 检查装修单是否已成功分配
	 * @param orderId 装修单号
	 * @return 数量（0表示未分配，>0表示已分配）
	 */
	int existSuccessQuotationAssignRecord(String orderId);

	/**
	 * 删除指定装修单的分配记录
	 * @param orderId 装修单号
	 * @return 影响行数
	 */
	int deleteQuotationAssignRecordByOrderId(String orderId);

	/**
	 * 批量删除指定时间之前的记录
	 * @param beforeTime 在此时间之前
	 * @return 影响行数
	 */
	int batchDeleteQuotationAssignRecordBeforeTime(java.sql.Timestamp beforeTime);
}

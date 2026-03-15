package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;

/**
 * 装修单预算分配记录表 DAO 接口
 */
public interface QuotationAssignRecordDao extends Dao<QuotationAssignRecordPO> {

	/**
	 * 查询装修单的所有分配记录
	 * @param orderId 装修单号
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> findByOrderId(String orderId);

	/**
	 * 查询预算员的所有分配记录
	 * @param uid 预算员用户ID
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> findByUid(Integer uid);

	/**
	 * 统计预算员的成功分配次数
	 * @param uid 预算员用户ID
	 * @return 成功次数
	 */
	int countSuccessByUid(Integer uid);

	/**
	 * 查询预算员最后一次成功分配记录
	 * @param uid 预算员用户ID
	 * @return 分配记录
	 */
	QuotationAssignRecordPO findLastSuccessByUid(Integer uid);
}

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 DAO 接口 职责: 追溯所有分配尝试（成功、失败、重新分配）
 */
public interface QuotationAssignRecordDao extends Dao<QuotationAssignRecordPO> {

	public void pageQuotationAssignRecord(Paging paging, List<Filter> filters, String orderId);

	public void pageQuotationAssignRecord(Paging paging, List<Filter> filters, int uid);

	/**
	 * 查询装修单的所有分配记录
	 * 
	 * @param orderId 装修单号
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecord(String orderId);

	/**
	 * 查询预算员的所有分配记录
	 * 
	 * @param uid 预算员用户ID
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecord(int uid);

	/**
	 * 查询指定装修单和预算员的分配记录
	 * 
	 * @param orderId 装修单号
	 * @param uid 预算员用户ID
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecord(String orderId, int uid);

}

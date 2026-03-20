/**
 * @File Name     : QuotationAssignRecordDao.java
 * @Package      : com.fanglin.quotation.dao
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表 DAO 接口
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 DAO 接口
 *
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignRecordDao extends Dao<QuotationAssignRecordPO> {

	/**
	 * 分页查询分配记录列表
	 *
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> pageQuotationAssignRecord(Paging paging, List<Filter> filters);

	/**
	 * 根据装修单号查询分配记录列表
	 *
	 * @param orderId 装修单号
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderId(String orderId);

	/**
	 * 统计预算员的工作量（成功分配数量）
	 *
	 * @param uid 预算员用户ID
	 * @return 成功分配数量
	 */
	int countSuccessAssignByUid(int uid);
}

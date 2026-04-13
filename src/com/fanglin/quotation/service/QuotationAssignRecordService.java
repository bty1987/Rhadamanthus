/**
 * @File Name     : QuotationAssignRecordService.java
 * @Package      : com.fanglin.quotation.service
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表 Service 接口
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignRecordVO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 Service 接口
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignRecordService {

	/**
	 * 分页查询分配记录列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID
	 * @throws FLException
	 */
	void pageQuotationAssignRecord(Paging paging, List<Filter> filters, Integer company) throws FLException;

	/**
	 * 根据ID查询分配记录
	 * 
	 * @param quotationAssignRecordVO 包含qasrid的VO对象
	 * @return 分配记录VO
	 * @throws FLException
	 */
	QuotationAssignRecordVO queryQuotationAssignRecordById(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException;

	/**
	 * 创建分配记录
	 * 
	 * @param quotationAssignRecordVO 分配记录VO
	 * @return 创建的记录数
	 */
	int createQuotationAssignRecord(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException;

	/**
	 * 根据装修单号查询分配记录列表
	 * 
	 * @param orderId 装修单号
	 * @return 分配记录列表
	 */
	List<QuotationAssignRecordVO> queryQuotationAssignRecordByOrderId(QuotationAssignRecordVO quotationAssignRecordVO) throws FLException;

	/**
	 * 统计预算员的工作量（成功分配数量）
	 * 
	 * @param uid 预算员用户ID
	 * @return 成功分配数量
	 */
	int countSuccessAssignByUid(int uid) throws FLException;
}

/**
 * @File Name     : QuotationAssignRequestService.java
 * @Package      : com.fanglin.quotation.service
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 Service 接口
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配请求表 Service 接口
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignRequestService {

	/**
	 * 分页查询分配请求列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID
	 */
	void pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company) throws FLException;

	/**
	 * 根据预算员userId分页查询分配请求
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param userId 预算员登录名
	 */
	void pageQuotationAssignRequestByUserId(Paging paging, List<Filter> filters, String userId) throws FLException;

	/**
	 * 根据ID查询分配请求
	 * 
	 * @param quotationAssignRequestVO 包含qarid的VO对象
	 * @return 分配请求VO
	 */
	QuotationAssignRequestVO queryQuotationAssignRequestById(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException;

	/**
	 * 根据装修单号查询待分配请求
	 * 
	 * @param orderId 装修单号
	 * @return 待分配请求VO
	 */
	QuotationAssignRequestVO queryQuotationAssignRequestForPending(String orderId) throws FLException;

	/**
	 * 查询待分配队列（用于自动分配）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @param decorationType 装修类型
	 * @return 待分配请求列表
	 */
	java.util.List<QuotationAssignRequestVO> queryQuotationAssignRequestForQueue(int company, Integer department, short decorationType) throws FLException;

	/**
	 * 创建分配请求
	 * 
	 * @param quotationAssignRequestVO 分配请求VO
	 * @return 创建的记录数
	 */
	int createQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException;

	/**
	 * 更新分配请求
	 * 
	 * @param quotationAssignRequestVO 分配请求VO
	 * @return 更新的记录数
	 */
	int updateQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException;

	/**
	 * 删除分配请求
	 * 
	 * @param quotationAssignRequestVO 包含qarid的VO对象
	 * @return 删除的记录数
	 */
	int deleteQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO) throws FLException;

}

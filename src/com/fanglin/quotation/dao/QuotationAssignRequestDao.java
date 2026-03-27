/**
 * @File Name     : QuotationAssignRequestDao.java
 * @Package      : com.fanglin.quotation.dao
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 DAO 接口
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignRequestPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配请求表 DAO 接口
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignRequestDao extends Dao<QuotationAssignRequestPO> {

	/**
	 * 分页查询分配请求列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID
	 * @return 分配请求列表
	 */
	List<QuotationAssignRequestPO> pageQuotationAssignRequest(Paging paging, List<Filter> filters, Integer company);

	/**
	 * 查询待分配队列（按优先级和请求时间排序）
	 *
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示所有部门）
	 * @param decorationType 装修类型（可选，NULL表示所有类型）
	 * @return 待分配请求列表
	 */
	List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueue(int company, Integer department, Short decorationType);

	/**
	 * 根据装修单号查询待分配请求
	 * 
	 * @param orderId 装修单号
	 * @return 待分配请求，如果不存在则返回null
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestForPending(String orderId);

	/**
	 * 根据装修单号查询已分配请求
	 * 
	 * @param orderId 装修单号
	 * @return 已分配请求，如果不存在则返回null
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestForAssigned(String orderId);

	/**
	 * 根据预算员用户ID查询当前任务数量
	 * 
	 * @param uid 预算员用户ID
	 * @return 当前任务数量（status=2的请求数量）
	 */
	int countQuotationAssignRequest(int uid);

}

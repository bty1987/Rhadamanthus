/**
 * @File Name     : QuotationAssignRequestDao.java
 * @Package      : com.fanglin.quotation.dao
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 DAO 接口（含已完成状态支持）
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
 * <p>
 * 状态说明：
 * </p>
 * <ul>
 * <li>1 - 待分配（在队列中等待）</li>
 * <li>2 - 已分配（成功分配给预算员，进行中）</li>
 * <li>3 - 已完成（报价已交付）</li>
 * </ul>
 * 
 * <p>
 * 装修单唯一约束：同一装修单在非已完成状态（status &lt; 3）下最多只有一条记录
 * </p>
 * 
 * @author Claude AI
 * @version 2.0
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
	 * 根据预算员userId分页查询分配请求
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param userId 预算员登录名
	 * @return 分配请求列表
	 */
	List<QuotationAssignRequestPO> pageQuotationAssignRequestByUserId(Paging paging, List<Filter> filters, String userId);

	/**
	 * 查询待分配队列（按优先级和请求时间排序）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示所有部门）
	 * @param decorationType 装修类型（可选，NULL表示所有类型）
	 * @return 待分配请求列表（status=1）
	 */
	List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueue(int company, Integer department, Short decorationType);

	/**
	 * 查询待分配队列（按多公司筛选）
	 * 
	 * <p>
	 * 用于反向分配场景：根据预算员适配的多个公司，一次性查出所有待分配请求，避免多次 DB 查询
	 * </p>
	 * 
	 * @param companies 公司ID列表
	 * @return 待分配请求列表（status=1），按优先级和请求时间排序
	 */
	List<QuotationAssignRequestPO> queryQuotationAssignRequestForQueue(List<Integer> companies);

	/**
	 * 根据装修单号查询活跃请求（非已完成状态，装修单唯一）
	 * 
	 * <p>
	 * 用于：分配前检查是否已有活跃请求、分配时更新已有请求
	 * </p>
	 * 
	 * @param orderId 装修单号
	 * @return 活跃请求（status=1或2），如果不存在则返回null
	 */
	QuotationAssignRequestPO queryActiveByOrderId(String orderId);

	/**
	 * 根据装修单号查询待分配请求（status=1）
	 * 
	 * @param orderId 装修单号
	 * @return 待分配请求，如果不存在则返回null
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestForPending(String orderId);

	/**
	 * 根据装修单号查询已分配请求（status=2）
	 * 
	 * @param orderId 装修单号
	 * @return 已分配请求，如果不存在则返回null
	 */
	QuotationAssignRequestPO queryQuotationAssignRequestForAssigned(String orderId);

	/**
	 * 根据预算员用户ID查询当前进行中任务数量（排除已完成）
	 * 
	 * <p>
	 * 统计 status &lt; 3 的请求数量（即待分配 + 已分配）
	 * </p>
	 * 
	 * @param uid 预算员用户ID
	 * @return 当前任务数量
	 */
	int countQuotationAssignRequest(int uid);

}

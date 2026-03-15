package com.fanglin.quotation.service;

import java.util.List;
import java.util.Map;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

/**
 * 待分配请求服务接口
 * 提供待分配队列的查询、优先级调整、取消等功能
 */
public interface QuotationAssignRequestService {

	/**
	 * 分页查询待分配请求列表
	 * @param paging 分页参数
	 * @param filters 过滤条件
	 * @return 待分配请求列表
	 */
	List<QuotationAssignRequestVO> pageAssignRequest(Paging paging, List<Filter> filters);

	/**
	 * 根据 ID 查询待分配请求
	 * @param barid 请求ID
	 * @return 待分配请求
	 */
	QuotationAssignRequestVO getAssignRequest(Integer barid);

	/**
	 * 根据订单号查询待分配请求
	 * @param orderId 订单号
	 * @return 待分配请求
	 */
	QuotationAssignRequestVO getAssignRequestByOrderId(String orderId);

	/**
	 * 更新请求优先级
	 * @param barid 请求ID
	 * @param priority 新优先级（1-最高，2-高，3-普通，4-低）
	 */
	void updatePriority(Integer barid, Byte priority);

	/**
	 * 取消请求
	 * @param barid 请求ID
	 * @param reason 取消原因
	 */
	void cancelRequest(Integer barid, String reason);

	/**
	 * 查询待分配队列统计信息
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 统计信息（总数量、各优先级数量、各类型数量等）
	 */
	Map<String, Object> getQueueStatistics(Integer company, Integer department);

	/**
	 * 查询待分配队列
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 待分配请求列表（按优先级和请求时间排序）
	 */
	List<QuotationAssignRequestVO> getPendingQueue(Integer company, Integer department);

	/**
	 * 查询队列位置
	 * @param company 公司ID
	 * @param requestTime 请求时间
	 * @return 队列位置（从1开始）
	 */
	int getQueuePosition(Integer company, Integer department, Long requestTime);
}

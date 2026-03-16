package com.fanglin.quotation.service;

import java.util.List;
import java.util.Map;

import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

/**
 * 待分配请求服务接口 提供待分配队列的查询、优先级调整、取消等功能
 */
public interface QuotationAssignRequestService {

	/**
	 * 分页查询待分配请求列表
	 * 
	 * @param paging 分页参数
	 * @param filters 过滤条件
	 * @return 待分配请求列表
	 */
	List<QuotationAssignRequestVO> pageQuotationAssignRequest(Paging paging, List<Filter> filters);

	/**
	 * 根据 ID 查询待分配请求
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含qarid）
	 * @return 待分配请求
	 */
	QuotationAssignRequestVO queryQuotationAssignRequestByQarid(QuotationAssignRequestVO quotationAssignRequestVO);

	/**
	 * 根据订单号查询待分配请求
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含orderId）
	 * @return 待分配请求
	 */
	QuotationAssignRequestVO queryQuotationAssignRequestByOrderId(QuotationAssignRequestVO quotationAssignRequestVO);

	/**
	 * 查询待分配队列统计信息
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含company和department）
	 * @param company 公司ID
	 * @return 统计信息（总数量、各优先级数量、各类型数量等）
	 */
	Map<String, Object> statisQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO, Integer company);

	/**
	 * 查询待分配队列
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含company和department）
	 * @param company 公司ID
	 * @return 待分配请求列表（按优先级和请求时间排序）
	 */
	List<QuotationAssignRequestVO> queueQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO, Integer company);

	/**
	 * 查询队列位置
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含company和requestTime）
	 * @param company 公司ID
	 * @return 队列位置（从1开始）
	 */
	int locateQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO, Integer company);

	/**
	 * 更新请求优先级
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含qarid和priority）
	 */
	void updateQuotationAssignRequestForPriority(QuotationAssignRequestVO quotationAssignRequestVO);

	/**
	 * 取消请求
	 * 
	 * @param quotationAssignRequestVO 请求VO（包含qarid和reason）
	 */
	void cancelQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequestVO);

}

package com.fanglin.quotation.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;

/**
 * 待分配请求管理 Action 提供待分配队列的查询、优先级调整、取消等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignRequestAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignRequestService quotationAssignRequestService;

	// 参数字段（使用VO对象）
	private QuotationAssignRequestVO quotationAssignRequest;

	// 返回字段
	private Map<String, Object> result; // 返回结果
	private List<QuotationAssignRequestVO> assignRequests; // 待分配请求列表
	private Map<String, Object> statistics; // 统计信息

	/**
	 * 分页查询待分配请求列表
	 * 
	 * 请求参数: - paging: 分页参数 - filters: 过滤条件
	 * 
	 * 返回数据: - total: 总记录数 - rows: 待分配请求列表
	 */
	@Action(value = "pageAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAssignRequest() throws FLException {

		quotationAssignRequestService.pageAssignRequest(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * 查询单个待分配请求
	 *
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需）
	 *
	 * 返回数据: - assignRequest: 待分配请求
	 */
	@Action(value = "queryAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssignRequest() throws FLException {
		assignRequest = quotationAssignRequestService.getAssignRequest(quotationAssignRequest.getQarid());
		return SUCCESS;
	}

	/**
	 * 根据订单号查询待分配请求
	 *
	 * 请求参数: - quotationAssignRequest.orderId: 订单号（必需）
	 *
	 * 返回数据: - assignRequest: 待分配请求
	 */
	@Action(value = "getAssignRequestByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getAssignRequestByOrderId() throws FLException {
		assignRequest = quotationAssignRequestService.getAssignRequestByOrderId(quotationAssignRequest.getOrderId());
		return SUCCESS;
	}

	/**
	 * 更新请求优先级
	 *
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需） - quotationAssignRequest.priority: 新优先级（1-最高，2-高，3-普通，4-低）
	 *
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "updateAssignRequestPriority", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssignRequestPriority() throws FLException {
		quotationAssignRequestService.updatePriority(quotationAssignRequest.getQarid(), quotationAssignRequest.getPriority());
		return SUCCESS;
	}

	/**
	 * 取消请求
	 *
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需） - quotationAssignRequest.reason: 取消原因（可选）
	 *
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "cancelAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelAssignRequest() throws FLException {
		quotationAssignRequestService.cancelRequest(quotationAssignRequest.getQarid(), quotationAssignRequest.getReason());
		return SUCCESS;
	}

	/**
	 * 查询待分配队列统计信息
	 *
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.department: 部门ID（可选）
	 *
	 * 返回数据: - statistics: 统计信息（总数量、各优先级数量、各类型数量等）
	 */
	@Action(value = "getQueueStatistics", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getQueueStatistics() throws FLException {
		quotationAssignRequest.setCompany(queryCompany());
		statistics = quotationAssignRequestService.getQueueStatistics(quotationAssignRequest.getCompany(), quotationAssignRequest.getDepartment());
		return SUCCESS;
	}

	/**
	 * 查询待分配队列
	 *
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.department: 部门ID（可选）
	 *
	 * 返回数据: - assignRequests: 待分配请求列表（按优先级和请求时间排序）
	 */
	@Action(value = "getPendingQueue", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getPendingQueue() throws FLException {
		quotationAssignRequest.setCompany(queryCompany());
		assignRequests = quotationAssignRequestService.getPendingQueue(quotationAssignRequest.getCompany(), quotationAssignRequest.getDepartment());
		return SUCCESS;
	}

	/**
	 * 查询队列位置
	 *
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.requestTime: 请求时间（毫秒时间戳）
	 *
	 * 返回数据: - position: 队列位置（从1开始）
	 */
	@Action(value = "getQueuePosition", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getQueuePosition() throws FLException {
		quotationAssignRequest.setCompany(queryCompany());
		quotationAssignRequestService.getQueuePosition(quotationAssignRequest.getCompany(), quotationAssignRequest.getRequestTime());
		return SUCCESS;
	}

	// Getter and Setter

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
	}

	public QuotationAssignRequestVO getQuotationAssignRequest() {
		return quotationAssignRequest;
	}

	public void setQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequest) {
		this.quotationAssignRequest = quotationAssignRequest;
	}

	public QuotationAssignRequestVO getAssignRequest() {
		return assignRequest;
	}

	public void setAssignRequest(QuotationAssignRequestVO assignRequest) {
		this.assignRequest = assignRequest;
	}

	public List<QuotationAssignRequestVO> getAssignRequests() {
		return assignRequests;
	}

	public void setAssignRequests(List<QuotationAssignRequestVO> assignRequests) {
		this.assignRequests = assignRequests;
	}

	public Map<String, Object> getStatistics() {
		return statistics;
	}

	public void setStatistics(Map<String, Object> statistics) {
		this.statistics = statistics;
	}
}

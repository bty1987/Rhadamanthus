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

	private static final long serialVersionUID = 2975473764595839282L;

	@Autowired
	private QuotationAssignRequestService quotationAssignRequestService;

	private QuotationAssignRequestVO quotationAssignRequest;

	private List<QuotationAssignRequestVO> quotationAssignRequests;

	private Map<String, Object> statistics;

	/**
	 * 分页查询待分配请求列表
	 * 
	 * 请求参数: - paging: 分页参数 - filters: 过滤条件
	 * 
	 * 返回数据: - total: 总记录数 - rows: 待分配请求列表
	 */
	@Action(value = "pageQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignRequest() throws FLException {

		quotationAssignRequestService.pageQuotationAssignRequest(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * 查询单个待分配请求
	 * 
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需）
	 * 
	 * 返回数据: - assignRequest: 待分配请求
	 */
	@Action(value = "queryQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignRequest() throws FLException {

		quotationAssignRequest = quotationAssignRequestService.queryQuotationAssignRequestByQarid(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 根据订单号查询待分配请求
	 * 
	 * 请求参数: - quotationAssignRequest.orderId: 订单号（必需）
	 * 
	 * 返回数据: - assignRequest: 待分配请求
	 */
	@Action(value = "getQuotationAssignRequestByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getQuotationAssignRequestByOrderId() throws FLException {

		quotationAssignRequest = quotationAssignRequestService.queryQuotationAssignRequestByOrderId(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 更新请求优先级
	 * 
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需） - quotationAssignRequest.priority: 新优先级（1-最高，2-高，3-普通，4-低）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "updateQuotationAssignRequestForPriority", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignRequestForPriority() throws FLException {

		quotationAssignRequestService.updateQuotationAssignRequestForPriority(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 取消请求
	 * 
	 * 请求参数: - quotationAssignRequest.qarid: 请求ID（必需） - quotationAssignRequest.reason: 取消原因（可选）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "cancelQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelQuotationAssignRequest() throws FLException {

		quotationAssignRequestService.cancelQuotationAssignRequest(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 查询待分配队列统计信息
	 * 
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.department: 部门ID（可选）
	 * 
	 * 返回数据: - statistics: 统计信息（总数量、各优先级数量、各类型数量等）
	 */
	@Action(value = "statisQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String statisQuotationAssignRequest() throws FLException {

		statistics = quotationAssignRequestService.statisQuotationAssignRequest(quotationAssignRequest, queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询待分配队列
	 * 
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.department: 部门ID（可选）
	 * 
	 * 返回数据: - assignRequests: 待分配请求列表（按优先级和请求时间排序）
	 */
	@Action(value = "queueQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queueQuotationAssignRequest() throws FLException {

		quotationAssignRequests = quotationAssignRequestService.queueQuotationAssignRequest(quotationAssignRequest, queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询队列位置
	 * 
	 * 请求参数: - quotationAssignRequest.company: 公司ID（必需） - quotationAssignRequest.requestTime: 请求时间（毫秒时间戳）
	 * 
	 * 返回数据: - position: 队列位置（从1开始）
	 */
	@Action(value = "locateQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String locateQuotationAssignRequest() throws FLException {

		quotationAssignRequestService.locateQuotationAssignRequest(quotationAssignRequest, queryCompany());

		return SUCCESS;
	}

	public QuotationAssignRequestVO getQuotationAssignRequest() {
		return quotationAssignRequest;
	}

	public void setQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequest) {
		this.quotationAssignRequest = quotationAssignRequest;
	}

	public Map<String, Object> getStatistics() {
		return statistics;
	}

	public void setStatistics(Map<String, Object> statistics) {
		this.statistics = statistics;
	}

	public List<QuotationAssignRequestVO> getQuotationAssignRequests() {
		return quotationAssignRequests;
	}

	public void setQuotationAssignRequests(List<QuotationAssignRequestVO> quotationAssignRequests) {
		this.quotationAssignRequests = quotationAssignRequests;
	}
}

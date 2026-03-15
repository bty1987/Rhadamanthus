package com.fanglin.quotation.action;

import java.util.HashMap;
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
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.service.QuotationAssignRequestService;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.utils.Paging;

/**
 * 待分配请求管理 Action
 * 提供待分配队列的查询、优先级调整、取消等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignRequestAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignRequestService quotationAssignRequestService;

	// 参数字段
	private Integer barid;			// 请求ID
	private String orderId;		// 订单号
	private Integer company;		// 公司ID
	private Integer department;	// 部门ID
	private Byte priority;		// 优先级
	private String reason;		// 取消原因
	private Long requestTime;	// 请求时间

	// 返回字段
	private Map<String, Object> result;					// 返回结果
	private QuotationAssignRequestVO assignRequest;	// 待分配请求
	private List<QuotationAssignRequestVO> assignRequests; // 待分配请求列表
	private Map<String, Object> statistics;			// 统计信息

	/**
	 * 分页查询待分配请求列表
	 *
	 * 请求参数:
	 * - paging: 分页参数
	 * - filters: 过滤条件
	 *
	 * 返回数据:
	 * - total: 总记录数
	 * - rows: 待分配请求列表
	 */
	@Action(value = "pageAssignRequest", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String pageAssignRequest() throws FLException {
		List<Filter> filters = getFilters();
		Paging paging = getPaging();
		List<QuotationAssignRequestVO> list = quotationAssignRequestService.pageAssignRequest(paging, filters);
		setRows(list);
		setTotal(paging.getTotal());
		return SUCCESS;
	}

	/**
	 * 查询单个待分配请求
	 *
	 * 请求参数:
	 * - barid: 请求ID（必需）
	 *
	 * 返回数据:
	 * - assignRequest: 待分配请求
	 */
	@Action(value = "getAssignRequest", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getAssignRequest() throws FLException {
		assignRequest = quotationAssignRequestService.getAssignRequest(barid);
		return SUCCESS;
	}

	/**
	 * 根据订单号查询待分配请求
	 *
	 * 请求参数:
	 * - orderId: 订单号（必需）
	 *
	 * 返回数据:
	 * - assignRequest: 待分配请求
	 */
	@Action(value = "getAssignRequestByOrderId", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getAssignRequestByOrderId() throws FLException {
		assignRequest = quotationAssignRequestService.getAssignRequestByOrderId(orderId);
		return SUCCESS;
	}

	/**
	 * 更新请求优先级
	 *
	 * 请求参数:
	 * - barid: 请求ID（必需）
	 * - priority: 新优先级（1-最高，2-高，3-普通，4-低）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "updateAssignRequestPriority", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateAssignRequestPriority() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationAssignRequestService.updatePriority(barid, priority);
			result.put("success", true);
			result.put("message", "优先级更新成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "优先级更新失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 取消请求
	 *
	 * 请求参数:
	 * - barid: 请求ID（必需）
	 * - reason: 取消原因（可选）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "cancelAssignRequest", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String cancelAssignRequest() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationAssignRequestService.cancelRequest(barid, reason);
			result.put("success", true);
			result.put("message", "请求已取消");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "取消失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 查询待分配队列统计信息
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - statistics: 统计信息（总数量、各优先级数量、各类型数量等）
	 */
	@Action(value = "getQueueStatistics", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQueueStatistics() throws FLException {
		statistics = quotationAssignRequestService.getQueueStatistics(company, department);
		return SUCCESS;
	}

	/**
	 * 查询待分配队列
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - assignRequests: 待分配请求列表（按优先级和请求时间排序）
	 */
	@Action(value = "getPendingQueue", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getPendingQueue() throws FLException {
		assignRequests = quotationAssignRequestService.getPendingQueue(company, department);
		return SUCCESS;
	}

	/**
	 * 查询队列位置
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 * - requestTime: 请求时间（毫秒时间戳）
	 *
	 * 返回数据:
	 * - position: 队列位置（从1开始）
	 */
	@Action(value = "getQueuePosition", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQueuePosition() throws FLException {
		result = new HashMap<String, Object>();

		try {
			int position = quotationAssignRequestService.getQueuePosition(company, department, requestTime);
			result.put("position", position);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "查询失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	// Getter and Setter

	public Integer getBarid() {
		return barid;
	}

	public void setBarid(Integer barid) {
		this.barid = barid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	public Byte getPriority() {
		return priority;
	}

	public void setPriority(Byte priority) {
		this.priority = priority;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Long getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(Long requestTime) {
		this.requestTime = requestTime;
	}

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
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

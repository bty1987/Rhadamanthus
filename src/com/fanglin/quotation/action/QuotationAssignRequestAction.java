/**
 * @File Name     : QuotationAssignRequestAction.java
 * @Package      : com.fanglin.quotation.action
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配请求表 Action 控制器
 */

package com.fanglin.quotation.action;

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

/**
 * 装修单预算分配请求表 Action 控制器
 * 
 * <p>
 * 职责：处理分配请求管理的 HTTP 请求
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>分页查询分配请求列表</li>
 * <li>查询分配请求详情</li>
 * <li>新增、编辑、删除分配请求</li>
 * <li>查询待分配队列</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignRequestAction extends BaseListAction {

	private static final long serialVersionUID = 9067044185640315559L;

	@Autowired
	private QuotationAssignRequestService quotationAssignRequestService;

	/**
	 * 分配请求对象（用于接收前端参数）
	 */
	private QuotationAssignRequestVO quotationAssignRequest;

	/**
	 * 分页查询分配请求列表
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignRequest() throws FLException {

		quotationAssignRequestService.pageQuotationAssignRequest(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	/**
	 * 预算员自助查询：分页查询当前登录预算员的分配请求
	 * 
	 * 自动注入当前登录用户的userId作为过滤条件
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignRequestSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignRequestSelf() throws FLException {

		String userId = queryUserId();

		if (userId == null || userId.trim().isEmpty()) {
			return ERROR;
		}

		// 将当前用户的userId注入为过滤条件
		List<Filter> filters = getFilters();
		if (filters == null) {
			filters = new java.util.ArrayList<Filter>();
		}
		filters.add(new Filter("userId", userId, "eq"));

		quotationAssignRequestService.pageQuotationAssignRequest(getPaging(), filters, queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询分配请求详情（用于编辑回显）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignRequestById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignRequestById() throws FLException {

		if (quotationAssignRequest == null) {
			return ERROR;
		}

		quotationAssignRequest = quotationAssignRequestService.queryQuotationAssignRequestById(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 新增分配请求
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "createQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignRequest() throws FLException {

		if (quotationAssignRequest == null) {
			return ERROR;
		}

		quotationAssignRequestService.createQuotationAssignRequest(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 更新分配请求
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignRequest() throws FLException {

		if (quotationAssignRequest == null) {
			return ERROR;
		}

		quotationAssignRequestService.updateQuotationAssignRequest(quotationAssignRequest);

		return SUCCESS;
	}

	/**
	 * 删除分配请求
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "deleteQuotationAssignRequest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignRequest() throws FLException {

		if (quotationAssignRequest == null) {
			return ERROR;
		}

		quotationAssignRequestService.deleteQuotationAssignRequest(quotationAssignRequest);

		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public QuotationAssignRequestVO getQuotationAssignRequest() {
		return quotationAssignRequest;
	}

	public void setQuotationAssignRequest(QuotationAssignRequestVO quotationAssignRequest) {
		this.quotationAssignRequest = quotationAssignRequest;
	}
}

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
import com.fanglin.quotation.service.QuotationAssignService;
import com.fanglin.quotation.vo.QuotationAssignRecordVO;
import com.fanglin.quotation.vo.QuotationAssignRequestVO;
import com.fanglin.quotation.vo.QuotationAssignVO;

/**
 * 装修单预算分配 Action 提供预算员自动分配、手动分配、重新分配等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignAction extends BaseListAction {

	private static final long serialVersionUID = -1615588964130278412L;

	@Autowired
	private QuotationAssignService quotationAssignService;

	// 参数字段（使用VO对象）
	private QuotationAssignVO quotationAssign;

	// 返回字段
	private Map<String, Object> result; // 返回结果
	private QuotationAssignRequestVO assignRequest; // 分配请求
	private List<QuotationAssignRequestVO> assignRequests; // 分配请求列表
	private List<QuotationAssignRecordVO> assignRecords; // 分配记录列表

	/**
	 * 自动分配预算员（含类型匹配）
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - companyId: 公司ID（必需） - decorationType: 装修类型（可选，1-半包，2-整装，默认从装修单获取）
	 * 
	 * 返回数据: - success: 是否成功 - budgetUid: 分配的预算员用户ID（成功时） - message: 提示信息
	 */
	@Action(value = "autoAssignBudgetUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String autoAssignBudgetUser() throws FLException {
		quotationAssign.setCompanyId(queryCompany());
		quotationAssignService.autoAssignBudgetUser(quotationAssign.getOrderId(), quotationAssign.getCompanyId(), quotationAssign.getDecorationType());

		return SUCCESS;
	}

	/**
	 * 手动分配预算员
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - budgetUid: 预算员用户ID（必需） - assignUid: 分配人用户ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "manualAssignBudgetUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String manualAssignBudgetUser() throws FLException {
		quotationAssignService.manualAssignBudgetUser(quotationAssign.getOrderId(), quotationAssign.getBudgetUid(), quotationAssign.getAssignUid());

		return SUCCESS;
	}

	/**
	 * 重新分配预算员
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - newBudgetUid: 新预算员用户ID（必需） - assignUid: 分配人用户ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "reassignBudgetUser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reassignBudgetUser() throws FLException {
		quotationAssignService.reassignBudgetUser(quotationAssign.getOrderId(), quotationAssign.getNewBudgetUid(), quotationAssign.getAssignUid());

		return SUCCESS;
	}

	/**
	 * 完成报价单，触发反向自动分配
	 * 
	 * 请求参数: - orderId: 装修单号（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "finishQuotation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishQuotation() throws FLException {
		quotationAssignService.finishQuotation(quotationAssign.getOrderId());

		return SUCCESS;
	}

	/**
	 * 检查是否启用预算分配功能
	 * 
	 * 请求参数: - companyId: 公司ID（必需） - departmentId: 部门ID（可选）
	 * 
	 * 返回数据: - enabled: 是否启用 - autoAssign: 是否自动分配
	 */
	@Action(value = "isQuotationAssignEnabled", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String isQuotationAssignEnabled() throws FLException {
		result = new HashMap<String, Object>();
		quotationAssign.setCompanyId(queryCompany());

		boolean enabled = quotationAssignService.isQuotationAssignEnabled(quotationAssign.getCompanyId(), quotationAssign.getDepartment());
		boolean autoAssign = quotationAssignService.isAutoAssign(quotationAssign.getCompanyId(), quotationAssign.getDepartment());

		result.put("enabled", enabled);
		result.put("autoAssign", autoAssign);

		return SUCCESS;
	}

	// Getter and Setter

	public QuotationAssignVO getQuotationAssign() {
		return quotationAssign;
	}

	public void setQuotationAssign(QuotationAssignVO quotationAssign) {
		this.quotationAssign = quotationAssign;
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

	public List<QuotationAssignRecordVO> getAssignRecords() {
		return assignRecords;
	}

	public void setAssignRecords(List<QuotationAssignRecordVO> assignRecords) {
		this.assignRecords = assignRecords;
	}
}

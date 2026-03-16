package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignService;
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

	private QuotationAssignVO quotationAssign;

	/**
	 * 自动分配预算员（含类型匹配）
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - companyId: 公司ID（必需） - decorationType: 装修类型（可选，1-半包，2-整装，默认从装修单获取）
	 * 
	 * 返回数据: - success: 是否成功 - budgetUid: 分配的预算员用户ID（成功时） - message: 提示信息
	 */
	@Action(value = "assignQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String assignQuotationAssign() throws FLException {

		quotationAssignService.assignQuotationAssign(quotationAssign, queryCompany());

		return SUCCESS;
	}

	/**
	 * 手动分配预算员
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - budgetUid: 预算员用户ID（必需） - assignUid: 分配人用户ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "manualQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String manualQuotationAssign() throws FLException {

		quotationAssignService.manualQuotationAssign(quotationAssign);

		return SUCCESS;
	}

	/**
	 * 重新分配预算员
	 * 
	 * 请求参数: - orderId: 装修单号（必需） - newBudgetUid: 新预算员用户ID（必需） - assignUid: 分配人用户ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "reassignQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reassignQuotationAssign() throws FLException {

		quotationAssignService.reassignQuotationAssign(quotationAssign);

		return SUCCESS;
	}

	/**
	 * 完成报价单，触发反向自动分配
	 * 
	 * 请求参数: - orderId: 装修单号（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "finishQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishQuotationAssign() throws FLException {

		quotationAssignService.finishQuotationAssign(quotationAssign);

		return SUCCESS;
	}

	public QuotationAssignVO getQuotationAssign() {
		return quotationAssign;
	}

	public void setQuotationAssign(QuotationAssignVO quotationAssign) {
		this.quotationAssign = quotationAssign;
	}
}

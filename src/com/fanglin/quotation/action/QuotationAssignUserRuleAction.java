/**
 * @File Name     : QuotationAssignUserRuleAction.java
 * @Package      : com.fanglin.quotation.action
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Action 控制器（人员维度 + Item 明细）
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignUserRuleItemService;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleItemVO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;

/**
 * 预算员规则表 Action 控制器
 * 
 * <p>
 * 职责：处理预算员规则管理的 HTTP 请求
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>分页查询预算员规则列表（含明细）</li>
 * <li>查询规则详情（编辑回显，含明细）</li>
 * <li>新增、编辑、删除规则（同时管理明细）</li>
 * <li>启用/停止预算员</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 2.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = 9067044185640315560L;

	@Autowired
	private QuotationAssignUserRuleService quotationAssignUserRuleService;

	@Autowired
	private QuotationAssignUserRuleItemService quotationAssignUserRuleItemService;

	/** 预算员规则对象（用于接收前端参数，含 items 列表） */
	private QuotationAssignUserRuleVO quotationAssignUserRule;

	/** 预算员规则明细对象（用于接收前端参数） */
	private QuotationAssignUserRuleItemVO quotationAssignUserRuleItem;

	/** 明细列表（用于返回查询结果） */
	private List<QuotationAssignUserRuleItemVO> quotationAssignUserRuleItems;

	/** 可分配预算员规则列表（用于返回反向查询结果） */
	private List<QuotationAssignUserRuleVO> quotationAssignUserRules;

	/** 查询参数：公司ID */
	private int company;

	/** 查询参数：部门ID（可选） */
	private Integer department;

	/** 查询参数：装修类型（可选） */
	private Short decorationType;

	/**
	 * 根据规则ID查询明细列表
	 */
	@Action(value = "queryQuotationAssignUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleItem() throws FLException {

		quotationAssignUserRuleItems = quotationAssignUserRuleItemService.queryQuotationAssignUserRuleItem(quotationAssignUserRuleItem);

		return SUCCESS;
	}

	/**
	 * 分页查询预算员规则列表
	 */
	@Action(value = "pageQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.pageQuotationAssignUserRule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询规则详情（含明细，用于编辑回显）
	 */
	@Action(value = "queryQuotationAssignUserRuleById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleById() throws FLException {

		quotationAssignUserRule = quotationAssignUserRuleService.queryQuotationAssignUserRuleById(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 新增预算员规则（同时创建明细项）
	 */
	@Action(value = "createQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.createQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 更新预算员规则（同时更新明细项）
	 */
	@Action(value = "updateQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.updateQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 删除预算员规则（同时删除明细项）
	 */
	@Action(value = "deleteQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.deleteQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 启用/停止预算员
	 */
	@Action(value = "updateQuotationAssignUserRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRuleForStatus() throws FLException {

		quotationAssignUserRuleService.updateQuotationAssignUserRuleForStatus(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 全集团预算员汇总查询（含实时任务数和状态）
	 */
	@Action(value = "pageQuotationAssignUserRuleSummary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRuleSummary() throws FLException {

		quotationAssignUserRuleService.pageQuotationAssignUserRuleSummary(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * 同步所有预算员的任务数和状态
	 */
	@Action(value = "syncQuotationAssignUserRuleStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncQuotationAssignUserRuleStatus() throws FLException {

		quotationAssignUserRuleService.syncQuotationAssignUserRuleStatus();

		return SUCCESS;
	}

	/**
	 * 根据公司/部门/装修类型查询可分配的预算员规则列表（反向查询）
	 */
	@Action(value = "queryQuotationAssignUserRuleForAvaile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleForAvaile() throws FLException {

		quotationAssignUserRules = quotationAssignUserRuleService.queryQuotationAssignUserRuleForAvaile(company, department, decorationType);

		return SUCCESS;
	}

	// ==================== Item 明细管理（独立页面） ====================

	/**
	 * 分页查询预算员规则明细列表
	 */
	@Action(value = "pageQuotationAssignUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRuleItem() throws FLException {

		quotationAssignUserRuleItemService.pageQuotationAssignUserRuleItem(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * 新增预算员规则明细
	 */
	@Action(value = "createQuotationAssignUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignUserRuleItem() throws FLException {

		quotationAssignUserRuleItemService.createQuotationAssignUserRuleItem(quotationAssignUserRuleItem);

		return SUCCESS;
	}

	/**
	 * 更新预算员规则明细
	 */
	@Action(value = "updateQuotationAssignUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRuleItem() throws FLException {

		quotationAssignUserRuleItemService.updateQuotationAssignUserRuleItem(quotationAssignUserRuleItem);

		return SUCCESS;
	}

	/**
	 * 删除预算员规则明细
	 */
	@Action(value = "deleteQuotationAssignUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignUserRuleItem() throws FLException {

		quotationAssignUserRuleItemService.deleteQuotationAssignUserRuleItem(quotationAssignUserRuleItem);

		return SUCCESS;
	}

	/**
	 * 独立页面新增预算员规则明细（自动查找/创建UserRule）
	 */
	@Action(value = "createQuotationAssignUserRuleItemWithRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignUserRuleItemWithRule() throws FLException {

		quotationAssignUserRuleItemService.createQuotationAssignUserRuleItemWithRule(quotationAssignUserRuleItem);

		return SUCCESS;
	}

	public QuotationAssignUserRuleVO getQuotationAssignUserRule() {
		return quotationAssignUserRule;
	}

	public void setQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) {
		this.quotationAssignUserRule = quotationAssignUserRule;
	}

	public QuotationAssignUserRuleItemVO getQuotationAssignUserRuleItem() {
		return quotationAssignUserRuleItem;
	}

	public void setQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO quotationAssignUserRuleItem) {
		this.quotationAssignUserRuleItem = quotationAssignUserRuleItem;
	}

	public List<QuotationAssignUserRuleItemVO> getQuotationAssignUserRuleItems() {
		return quotationAssignUserRuleItems;
	}

	public void setQuotationAssignUserRuleItems(List<QuotationAssignUserRuleItemVO> quotationAssignUserRuleItems) {
		this.quotationAssignUserRuleItems = quotationAssignUserRuleItems;
	}

	public List<QuotationAssignUserRuleVO> getQuotationAssignUserRules() {
		return quotationAssignUserRules;
	}

	public void setQuotationAssignUserRules(List<QuotationAssignUserRuleVO> quotationAssignUserRules) {
		this.quotationAssignUserRules = quotationAssignUserRules;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public Integer getDepartment() {
		return department;
	}

	public void setDepartment(Integer department) {
		this.department = department;
	}

	public Short getDecorationType() {
		return decorationType;
	}

	public void setDecorationType(Short decorationType) {
		this.decorationType = decorationType;
	}
}

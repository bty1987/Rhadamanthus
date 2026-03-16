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
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;

/**
 * 报价单预算员规则 Action 提供预算员规则管理 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignUserRuleService quotationAssignUserRuleService;

	// 参数字段
	private QuotationAssignUserRuleVO quotationAssignUserRule;
	private List<QuotationAssignUserRuleVO> quotationAssignUserRules;

	// 返回字段
	private Map<String, Object> result;

	/**
	 * 分页查询预算员规则
	 * 
	 * @throws FLException
	 */
	@Action(value = "pageQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.pageQuotationAssignUserRule(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 */
	@Action(value = "queryQuotationAssignUserRuleByUidAndCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByUidAndCompany() {

		quotationAssignUserRule = quotationAssignUserRuleService.queryQuotationAssignUserRuleByUidAndCompany(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 根据用户ID查询预算员规则
	 */
	@Action(value = "queryQuotationAssignUserRuleByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByUid() {

		quotationAssignUserRule = quotationAssignUserRuleService.queryQuotationAssignUserRuleByUid(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 查询公司的所有预算员
	 * 
	 * @throws FLException
	 */
	@Action(value = "queryQuotationAssignUserRuleByCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByCompany() throws FLException {

		quotationAssignUserRules = quotationAssignUserRuleService.queryQuotationAssignUserRuleByCompany(queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询指定部门的预算员列表
	 * 
	 * @throws FLException
	 */
	@Action(value = "queryQuotationAssignUserRuleByDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByDepartment() throws FLException {

		quotationAssignUserRules = quotationAssignUserRuleService.queryQuotationAssignUserRuleByDepartment(queryCompany(), quotationAssignUserRule.getDepartment());

		return SUCCESS;
	}

	/**
	 * 查询可用的预算员列表（状态为待分配）
	 * 
	 * @throws FLException
	 */
	@Action(value = "pullAvailableQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pullAvailableQuotationAssignUserRule() throws FLException {

		quotationAssignUserRules = quotationAssignUserRuleService.pullAvailableQuotationAssignUserRule(queryCompany(), quotationAssignUserRule.getDepartment());

		return SUCCESS;
	}

	/**
	 * 添加预算员规则
	 * 
	 * @throws FLException
	 */
	@Action(value = "addQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.addQuotationAssignUserRule(quotationAssignUserRule, queryUserId());

		return SUCCESS;
	}

	/**
	 * 更新预算员规则
	 * 
	 * @throws FLException
	 */
	@Action(value = "updateQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.updateQuotationAssignUserRule(quotationAssignUserRule, queryUserId());

		return SUCCESS;
	}

	/**
	 * 更新预算员状态和任务数量
	 * 
	 * @throws FLException
	 */
	@Action(value = "updateStatusAndTaskCount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateStatusAndTaskCount() throws FLException {

		quotationAssignUserRuleService.updateStatusAndTaskCount(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 启用预算员
	 * 
	 * @throws FLException
	 */
	@Action(value = "enableQuotationAssignUserRuleByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String enableQuotationAssignUserRuleByUid() throws FLException {

		quotationAssignUserRuleService.enableQuotationAssignUserRuleByUid(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 禁用预算员
	 * 
	 * @throws FLException
	 */
	@Action(value = "disableQuotationAssignUserRuleByUid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableQuotationAssignUserRuleByUid() throws FLException {

		quotationAssignUserRuleService.disableQuotationAssignUserRuleByUid(quotationAssignUserRule);

		return SUCCESS;
	}

	public QuotationAssignUserRuleVO getQuotationAssignUserRule() {
		return quotationAssignUserRule;
	}

	public void setQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) {
		this.quotationAssignUserRule = quotationAssignUserRule;
	}

	public List<QuotationAssignUserRuleVO> getQuotationAssignUserRules() {
		return quotationAssignUserRules;
	}

	public void setQuotationAssignUserRules(List<QuotationAssignUserRuleVO> quotationAssignUserRules) {
		this.quotationAssignUserRules = quotationAssignUserRules;
	}

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
	}
}

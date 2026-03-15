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
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;

/**
 * 报价单预算员规则 Action
 * 提供预算员规则管理 API 接口
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
	 */
	@Action(value = "pageQuotationAssignUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRule() {
		try {
			List<QuotationAssignUserRuleVO> list = quotationAssignUserRuleService
				.pageQuotationAssignUserRule(getPaging(), getFilters(), getCompany());

			result = new HashMap<String, Object>();
			result.put("total", getPaging().getTotalRows());
			result.put("rows", list);
			result.put("code", 200);
			result.put("message", "查询成功");
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 */
	@Action(value = "queryQuotationAssignUserRuleByUidAndCompany", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByUidAndCompany() {
		try {
			QuotationAssignUserRuleVO vo = quotationAssignUserRuleService
				.queryQuotationAssignUserRuleByUidAndCompany(quotationAssignUserRule);

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "查询成功");
			result.put("data", vo);
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 根据用户ID查询预算员规则
	 */
	@Action(value = "queryQuotationAssignUserRuleByUid", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByUid() {
		try {
			QuotationAssignUserRuleVO vo = quotationAssignUserRuleService
				.queryQuotationAssignUserRuleByUid(quotationAssignUserRule);

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "查询成功");
			result.put("data", vo);
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 查询公司的所有预算员
	 */
	@Action(value = "queryQuotationAssignUserRuleByCompany", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByCompany() {
		try {
			List<QuotationAssignUserRuleVO> list = quotationAssignUserRuleService
				.queryQuotationAssignUserRuleByCompany(getCompany());

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "查询成功");
			result.put("data", list);
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 查询指定部门的预算员列表
	 */
	@Action(value = "queryQuotationAssignUserRuleByDepartment", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleByDepartment() {
		try {
			List<QuotationAssignUserRuleVO> list = quotationAssignUserRuleService
				.queryQuotationAssignUserRuleByDepartment(getCompany(), quotationAssignUserRule.getDepartment());

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "查询成功");
			result.put("data", list);
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 查询可用的预算员列表（状态为待分配）
	 */
	@Action(value = "pullAvailableQuotationAssignUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String pullAvailableQuotationAssignUserRule() {
		try {
			List<QuotationAssignUserRuleVO> list = quotationAssignUserRuleService
				.pullAvailableQuotationAssignUserRule(getCompany(), quotationAssignUserRule.getDepartment());

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "查询成功");
			result.put("data", list);
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 添加预算员规则
	 */
	@Action(value = "addQuotationAssignUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String addQuotationAssignUserRule() {
		try {
			quotationAssignUserRuleService.addQuotationAssignUserRule(
				quotationAssignUserRule, queryUserId());

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "添加成功");
		} catch (FLException e) {
			result = new HashMap<String, Object>();
			result.put("code", e.getErrorCode());
			result.put("message", e.getMessage());
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 更新预算员规则
	 */
	@Action(value = "updateQuotationAssignUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRule() {
		try {
			quotationAssignUserRuleService.updateQuotationAssignUserRule(
				quotationAssignUserRule, queryUserId());

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "更新成功");
		} catch (FLException e) {
			result = new HashMap<String, Object>();
			result.put("code", e.getErrorCode());
			result.put("message", e.getMessage());
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 更新预算员状态和任务数量
	 */
	@Action(value = "updateStatusAndTaskCount", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateStatusAndTaskCount() {
		try {
			quotationAssignUserRuleService.updateStatusAndTaskCount(quotationAssignUserRule);

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "更新成功");
		} catch (FLException e) {
			result = new HashMap<String, Object>();
			result.put("code", e.getErrorCode());
			result.put("message", e.getMessage());
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 启用预算员
	 */
	@Action(value = "enableQuotationAssignUserRuleByUid", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String enableQuotationAssignUserRuleByUid() {
		try {
			quotationAssignUserRuleService.enableQuotationAssignUserRuleByUid(quotationAssignUserRule);

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "启用成功");
		} catch (FLException e) {
			result = new HashMap<String, Object>();
			result.put("code", e.getErrorCode());
			result.put("message", e.getMessage());
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	/**
	 * 禁用预算员
	 */
	@Action(value = "disableQuotationAssignUserRuleByUid", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String disableQuotationAssignUserRuleByUid() {
		try {
			quotationAssignUserRuleService.disableQuotationAssignUserRuleByUid(quotationAssignUserRule);

			result = new HashMap<String, Object>();
			result.put("code", 200);
			result.put("message", "禁用成功");
		} catch (FLException e) {
			result = new HashMap<String, Object>();
			result.put("code", e.getErrorCode());
			result.put("message", e.getMessage());
		} catch (Exception e) {
			result = new HashMap<String, Object>();
			result.put("code", 500);
			result.put("message", e.getMessage());
		}
		return SUCCESS;
	}

	// Getter and Setter

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

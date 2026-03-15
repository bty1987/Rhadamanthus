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
import com.fanglin.quotation.service.BudgetUserRuleService;
import com.fanglin.quotation.vo.BudgetUserRuleVO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则管理 Action
 * 提供预算员的增删改查、类型管理、状态更新等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class BudgetUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private BudgetUserRuleService budgetUserRuleService;

	// 参数字段
	private Integer burid;				// 预算员规则ID
	private Integer uid;				// 用户ID
	private Integer company;			// 公司ID
	private Integer department;			// 部门ID
	private Byte status;				// 状态
	private List<Byte> supportedTypes;	// 支持的类型列表

	// 返回字段
	private Map<String, Object> result;			// 返回结果
	private BudgetUserRuleVO budgetUserRule;	// 预算员规则
	private List<BudgetUserRuleVO> budgetUserRules; // 预算员规则列表

	/**
	 * 分页查询预算员规则列表
	 *
	 * 请求参数:
	 * - paging: 分页参数
	 * - filters: 过滤条件
	 *
	 * 返回数据:
	 * - total: 总记录数
	 * - rows: 预算员规则列表
	 */
	@Action(value = "pageBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String pageBudgetUserRule() throws FLException {
		List<Filter> filters = getFilters();
		Paging paging = getPaging();
		List<BudgetUserRuleVO> list = budgetUserRuleService.pageBudgetUserRule(paging, filters);
		setRows(list);
		setTotal(paging.getTotal());
		return SUCCESS;
	}

	/**
	 * 查询单个预算员规则
	 *
	 * 请求参数:
	 * - burid: 预算员规则ID（必需）
	 *
	 * 返回数据:
	 * - budgetUserRule: 预算员规则
	 */
	@Action(value = "getBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getBudgetUserRule() throws FLException {
		budgetUserRule = budgetUserRuleService.getBudgetUserRule(burid);
		return SUCCESS;
	}

	/**
	 * 根据用户ID查询预算员规则
	 *
	 * 请求参数:
	 * - uid: 用户ID（必需）
	 *
	 * 返回数据:
	 * - budgetUserRule: 预算员规则
	 */
	@Action(value = "getBudgetUserRuleByUid", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getBudgetUserRuleByUid() throws FLException {
		budgetUserRule = budgetUserRuleService.getBudgetUserRuleByUid(uid);
		return SUCCESS;
	}

	/**
	 * 保存预算员规则（新增或更新）
	 *
	 * 请求参数:
	 * - budgetUserRule: 预算员规则对象
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "saveBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String saveBudgetUserRule() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.saveBudgetUserRule(budgetUserRule);
			result.put("success", true);
			result.put("message", "保存成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "保存失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 更新预算员规则
	 *
	 * 请求参数:
	 * - budgetUserRule: 预算员规则对象
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "updateBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateBudgetUserRule() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.updateBudgetUserRule(budgetUserRule);
			result.put("success", true);
			result.put("message", "更新成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "更新失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 删除预算员规则
	 *
	 * 请求参数:
	 * - burid: 预算员规则ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "deleteBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String deleteBudgetUserRule() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.deleteBudgetUserRule(burid);
			result.put("success", true);
			result.put("message", "删除成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "删除失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 保存预算员支持的类型列表
	 *
	 * 请求参数:
	 * - burid: 预算员规则ID（必需）
	 * - supportedTypes: 类型列表（1-半包，2-整装）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "saveBudgetUserRuleTypes", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String saveBudgetUserRuleTypes() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.saveBudgetUserRuleTypes(burid, supportedTypes);
			result.put("success", true);
			result.put("message", "类型配置保存成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "类型配置保存失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 更新预算员状态
	 *
	 * 请求参数:
	 * - uid: 用户ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "updateBudgetUserStatus", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateBudgetUserStatus() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.updateBudgetUserStatus(uid);
			result.put("success", true);
			result.put("message", "状态更新成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "状态更新失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 停用预算员
	 *
	 * 请求参数:
	 * - burid: 预算员规则ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "disableBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String disableBudgetUserRule() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.disableBudgetUserRule(burid);
			result.put("success", true);
			result.put("message", "停用成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "停用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 启用预算员
	 *
	 * 请求参数:
	 * - burid: 预算员规则ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "enableBudgetUserRule", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String enableBudgetUserRule() throws FLException {
		result = new HashMap<String, Object>();

		try {
			budgetUserRuleService.enableBudgetUserRule(burid);
			result.put("success", true);
			result.put("message", "启用成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "启用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 查询公司的所有预算员
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 *
	 * 返回数据:
	 * - budgetUserRules: 预算员规则列表
	 */
	@Action(value = "getBudgetUsersByCompany", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getBudgetUsersByCompany() throws FLException {
		budgetUserRules = budgetUserRuleService.getBudgetUsersByCompany(company);
		return SUCCESS;
	}

	/**
	 * 查询待分配的预算员列表
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - budgetUserRules: 预算员规则列表
	 */
	@Action(value = "getAvailableBudgetUsers", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getAvailableBudgetUsers() throws FLException {
		budgetUserRules = budgetUserRuleService.getAvailableBudgetUsers(company, department);
		return SUCCESS;
	}

	// Getter and Setter

	public Integer getBurid() {
		return burid;
	}

	public void setBurid(Integer burid) {
		this.burid = burid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
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

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public List<Byte> getSupportedTypes() {
		return supportedTypes;
	}

	public void setSupportedTypes(List<Byte> supportedTypes) {
		this.supportedTypes = supportedTypes;
	}

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
	}

	public BudgetUserRuleVO getBudgetUserRule() {
		return budgetUserRule;
	}

	public void setBudgetUserRule(BudgetUserRuleVO budgetUserRule) {
		this.budgetUserRule = budgetUserRule;
	}

	public List<BudgetUserRuleVO> getBudgetUserRules() {
		return budgetUserRules;
	}

	public void setBudgetUserRules(List<BudgetUserRuleVO> budgetUserRules) {
		this.budgetUserRules = budgetUserRules;
	}
}

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

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignConfigService;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;

/**
 * 报价单预算配置管理 Action
 * 提供预算配置的查询、保存、启用/禁用等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignConfigAction extends BaseAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignConfigService quotationAssignConfigService;

	// 参数字段
	private Long qacid;				// 配置ID
	private Integer company;			// 公司ID
	private Integer department;		// 部门ID
	private Short enabled;			// 是否启用（1-启用，0-禁用）
	private Short autoAssign;		// 是否自动分配（1-自动，0-手动）

	// 返回字段
	private Map<String, Object> result;						// 返回结果
	private QuotationAssignConfigVO quotationAssignConfig;	// 预算配置
	private List<QuotationAssignConfigVO> quotationAssignConfigs; // 预算配置列表

	/**
	 * 查询预算配置
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - quotationAssignConfig: 预算配置
	 */
	@Action(value = "getQuotationAssignConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQuotationAssignConfig() throws FLException {
		QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
		vo.setCompany(company);
		vo.setDepartment(department);

		quotationAssignConfig = quotationAssignConfigService.queryQuotationAssignConfigByCompanyAndDepartment(vo);
		return SUCCESS;
	}

	/**
	 * 根据公司ID查询所有预算配置
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 *
	 * 返回数据:
	 * - quotationAssignConfigs: 预算配置列表
	 */
	@Action(value = "getQuotationAssignConfigsByCompany", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQuotationAssignConfigsByCompany() throws FLException {
		QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
		vo.setCompany(company);

		quotationAssignConfigs = quotationAssignConfigService.queryQuotationAssignConfigByCompany(vo);
		return SUCCESS;
	}

	/**
	 * 保存预算配置（新增或更新）
	 *
	 * 请求参数:
	 * - quotationAssignConfig: 预算配置对象
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "saveQuotationAssignConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String saveQuotationAssignConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationAssignConfigService.saveQuotationAssignConfig(quotationAssignConfig, getUserId());
			result.put("success", true);
			result.put("message", "保存成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "保存失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 删除预算配置
	 *
	 * 请求参数:
	 * - qacid: 配置ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "deleteQuotationAssignConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String deleteQuotationAssignConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
			vo.setQacid(qacid);
			quotationAssignConfigService.deleteQuotationAssignConfig(vo, getUserId());
			result.put("success", true);
			result.put("message", "删除成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "删除失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 启用预算分配功能
	 *
	 * 请求参数:
	 * - qacid: 配置ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "enableQuotationAssignConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String enableQuotationAssignConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
			vo.setQacid(qacid);
			quotationAssignConfigService.enableQuotationAssignConfig(vo, getUserId());
			result.put("success", true);
			result.put("message", "已启用预算分配功能");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "启用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 禁用预算分配功能
	 *
	 * 请求参数:
	 * - qacid: 配置ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "disableQuotationAssignConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String disableQuotationAssignConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
			vo.setQacid(qacid);
			quotationAssignConfigService.disableQuotationAssignConfig(vo, getUserId());
			result.put("success", true);
			result.put("message", "已禁用预算分配功能");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "禁用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 检查是否启用预算分配功能
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - enabled: 是否启用
	 */
	@Action(value = "isQuotationAssignEnabled", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String isQuotationAssignEnabled() throws FLException {
		result = new HashMap<String, Object>();

		try {
			QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
			vo.setCompany(company);
			vo.setDepartment(department);

			boolean enabled = quotationAssignConfigService.isQuotationAssignEnabled(vo);
			result.put("enabled", enabled);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "查询失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 检查是否启用自动分配模式
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - autoAssign: 是否自动分配
	 */
	@Action(value = "isAutoAssignEnabled", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String isAutoAssignEnabled() throws FLException {
		result = new HashMap<String, Object>();

		try {
			QuotationAssignConfigVO vo = new QuotationAssignConfigVO();
			vo.setCompany(company);
			vo.setDepartment(department);

			boolean autoAssign = quotationAssignConfigService.isAutoAssignEnabled(vo);
			result.put("autoAssign", autoAssign);
			result.put("success", true);
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "查询失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	// Getter and Setter

	public Long getQacid() {
		return qacid;
	}

	public void setQacid(Long qacid) {
		this.qacid = qacid;
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

	public Short getEnabled() {
		return enabled;
	}

	public void setEnabled(Short enabled) {
		this.enabled = enabled;
	}

	public Short getAutoAssign() {
		return autoAssign;
	}

	public void setAutoAssign(Short autoAssign) {
		this.autoAssign = autoAssign;
	}

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
	}

	public QuotationAssignConfigVO getQuotationAssignConfig() {
		return quotationAssignConfig;
	}

	public void setQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig) {
		this.quotationAssignConfig = quotationAssignConfig;
	}

	public List<QuotationAssignConfigVO> getQuotationAssignConfigs() {
		return quotationAssignConfigs;
	}

	public void setQuotationAssignConfigs(List<QuotationAssignConfigVO> quotationAssignConfigs) {
		this.quotationAssignConfigs = quotationAssignConfigs;
	}
}

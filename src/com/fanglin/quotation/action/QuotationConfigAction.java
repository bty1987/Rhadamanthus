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
import com.fanglin.quotation.service.QuotationConfigService;
import com.fanglin.quotation.vo.QuotationConfigVO;

/**
 * 预算配置管理 Action
 * 提供预算配置的查询、保存、启用/禁用等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationConfigAction extends BaseAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationConfigService quotationConfigService;

	// 参数字段
	private Integer qcid;			// 预算配置ID
	private Integer company;		// 公司ID
	private Integer department;	// 部门ID
	private Byte enabled;			// 是否启用（1-启用，0-禁用）
	private Byte autoAssign;		// 是否自动分配（1-自动，0-手动）

	// 返回字段
	private Map<String, Object> result;			// 返回结果
	private QuotationConfigVO quotationConfig;	// 预算配置
	private List<QuotationConfigVO> quotationConfigs; // 预算配置列表

	/**
	 * 查询预算配置
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - quotationConfig: 预算配置
	 */
	@Action(value = "getQuotationConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQuotationConfig() throws FLException {
		quotationConfig = quotationConfigService.getQuotationConfig(company, department);
		return SUCCESS;
	}

	/**
	 * 根据公司ID查询所有预算配置
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 *
	 * 返回数据:
	 * - quotationConfigs: 预算配置列表
	 */
	@Action(value = "getQuotationConfigsByCompany", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String getQuotationConfigsByCompany() throws FLException {
		quotationConfigs = quotationConfigService.getQuotationConfigsByCompany(company);
		return SUCCESS;
	}

	/**
	 * 保存预算配置（新增或更新）
	 *
	 * 请求参数:
	 * - quotationConfig: 预算配置对象
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "saveQuotationConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String saveQuotationConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.saveQuotationConfig(quotationConfig);
			result.put("success", true);
			result.put("message", "保存成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "保存失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 更新预算配置
	 *
	 * 请求参数:
	 * - quotationConfig: 预算配置对象
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "updateQuotationConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateQuotationConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.updateQuotationConfig(quotationConfig);
			result.put("success", true);
			result.put("message", "更新成功");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "更新失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 删除预算配置
	 *
	 * 请求参数:
	 * - qcid: 预算配置ID（必需）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "deleteQuotationConfig", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String deleteQuotationConfig() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.deleteQuotationConfig(qcid);
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
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "enableQuotationAssign", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String enableQuotationAssign() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.enableQuotationAssign(company, department);
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
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "disableQuotationAssign", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String disableQuotationAssign() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.disableQuotationAssign(company, department);
			result.put("success", true);
			result.put("message", "已禁用预算分配功能");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "禁用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 启用自动分配模式
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "enableAutoAssign", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String enableAutoAssign() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.enableAutoAssign(company, department);
			result.put("success", true);
			result.put("message", "已启用自动分配模式");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "启用失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	/**
	 * 禁用自动分配模式（改为手动分配模式）
	 *
	 * 请求参数:
	 * - company: 公司ID（必需）
	 * - department: 部门ID（可选）
	 *
	 * 返回数据:
	 * - success: 是否成功
	 * - message: 提示信息
	 */
	@Action(value = "disableAutoAssign", results = {
		@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String disableAutoAssign() throws FLException {
		result = new HashMap<String, Object>();

		try {
			quotationConfigService.disableAutoAssign(company, department);
			result.put("success", true);
			result.put("message", "已切换为手动分配模式");
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "切换失败: " + e.getMessage());
		}

		return SUCCESS;
	}

	// Getter and Setter

	public Integer getQcid() {
		return qcid;
	}

	public void setQcid(Integer qcid) {
		this.qcid = qcid;
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

	public Byte getEnabled() {
		return enabled;
	}

	public void setEnabled(Byte enabled) {
		this.enabled = enabled;
	}

	public Byte getAutoAssign() {
		return autoAssign;
	}

	public void setAutoAssign(Byte autoAssign) {
		this.autoAssign = autoAssign;
	}

	public Map<String, Object> getResult() {
		return result;
	}

	public void setResult(Map<String, Object> result) {
		this.result = result;
	}

	public QuotationConfigVO getQuotationConfig() {
		return quotationConfig;
	}

	public void setQuotationConfig(QuotationConfigVO quotationConfig) {
		this.quotationConfig = quotationConfig;
	}

	public List<QuotationConfigVO> getQuotationConfigs() {
		return quotationConfigs;
	}

	public void setQuotationConfigs(List<QuotationConfigVO> quotationConfigs) {
		this.quotationConfigs = quotationConfigs;
	}
}

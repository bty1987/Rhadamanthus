package com.fanglin.quotation.action;

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
 * 报价单预算配置管理 Action 提供预算配置的查询、保存、启用/禁用等 API 接口
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignConfigAction extends BaseAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignConfigService quotationAssignConfigService;

	// 参数字段（使用VO对象）
	private QuotationAssignConfigVO quotationAssignConfig;

	// 返回字段
	private Map<String, Object> result; // 返回结果
	private List<QuotationAssignConfigVO> quotationAssignConfigs; // 预算配置列表

	/**
	 * 查询预算配置
	 * 
	 * 请求参数: - quotationAssignConfig.company: 公司ID（必需） - quotationAssignConfig.department: 部门ID（可选）
	 * 
	 * 返回数据: - quotationAssignConfig: 预算配置
	 */
	@Action(value = "queryQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignConfig() throws FLException {

		quotationAssignConfig = quotationAssignConfigService.queryQuotationAssignConfigByCompanyAndDepartment(quotationAssignConfig, queryCompany());
		return SUCCESS;
	}

	/**
	 * 根据公司ID查询所有预算配置
	 * 
	 * 请求参数: - quotationAssignConfig.company: 公司ID（必需）
	 * 
	 * 返回数据: - quotationAssignConfigs: 预算配置列表
	 */
	@Action(value = "getQuotationAssignConfigsByCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String getQuotationAssignConfigsByCompany() throws FLException {

		quotationAssignConfigs = quotationAssignConfigService.queryQuotationAssignConfigByCompany(quotationAssignConfig, queryCompany());

		return SUCCESS;
	}

	/**
	 * 保存预算配置（新增或更新）
	 * 
	 * 请求参数: - quotationAssignConfig: 预算配置对象
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "saveQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.saveQuotationAssignConfig(quotationAssignConfig, queryUserId());

		return SUCCESS;
	}

	/**
	 * 删除预算配置
	 * 
	 * 请求参数: - quotationAssignConfig.qacid: 配置ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "deleteQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.deleteQuotationAssignConfig(quotationAssignConfig, queryUserId());

		return SUCCESS;
	}

	/**
	 * 启用预算分配功能
	 * 
	 * 请求参数: - quotationAssignConfig.qacid: 配置ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "enableQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String enableQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.enableQuotationAssignConfig(quotationAssignConfig, queryUserId());

		return SUCCESS;
	}

	/**
	 * 禁用预算分配功能
	 * 
	 * 请求参数: - quotationAssignConfig.qacid: 配置ID（必需）
	 * 
	 * 返回数据: - success: 是否成功 - message: 提示信息
	 */
	@Action(value = "disableQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.disableQuotationAssignConfig(quotationAssignConfig, queryUserId());

		return SUCCESS;
	}

	/**
	 * 检查是否启用预算分配功能
	 *
	 * 请求参数: - quotationAssignConfig.company: 公司ID（必需） - quotationAssignConfig.department: 部门ID（可选）
	 *
	 * 返回数据: - enabled: 是否启用
	 */
	@Action(value = "isQuotationAssignEnabled", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String isQuotationAssignEnabled() throws FLException {

		quotationAssignConfigService.queryQuotationAssignEnabled(quotationAssignConfig, queryCompany());

		return SUCCESS;
	}

	/**
	 * 检查是否启用自动分配模式
	 *
	 * 请求参数: - quotationAssignConfig.company: 公司ID（必需） - quotationAssignConfig.department: 部门ID（可选）
	 *
	 * 返回数据: - autoAssign: 是否自动分配
	 */
	@Action(value = "isAutoAssignEnabled", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String isAutoAssignEnabled() throws FLException {

		quotationAssignConfigService.queryAutoAssignEnabled(quotationAssignConfig, queryCompany());

		return SUCCESS;
	}

	// Getter and Setter

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

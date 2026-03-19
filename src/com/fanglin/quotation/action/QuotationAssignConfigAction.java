/**
 * @File Name		: QuotationAssignConfigAction.java
 * @Package  	: com.fanglin.quotation.action
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 Action 控制器
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
import com.fanglin.quotation.service.QuotationAssignConfigService;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;

/**
 * 预算配置表 Action 控制器
 * 
 * <p>
 * 职责：处理预算配置管理的 HTTP 请求
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>分页查询配置列表</li>
 * <li>查询配置详情</li>
 * <li>新增、编辑、删除配置</li>
 * <li>启用/禁用配置</li>
 * <li>切换自动分配模式</li>
 * </ul>
 * 
 * @author bty1987
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignConfigAction extends BaseListAction {

	private static final long serialVersionUID = 9067044185640315559L;

	@Autowired
	private QuotationAssignConfigService quotationAssignConfigService;

	/**
	 * 配置对象（用于接收前端参数）
	 */
	private QuotationAssignConfigVO quotationAssignConfig;

	/**
	 * 分页查询配置列表
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.pageQuotationAssignConfig(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	/**
	 * 查询配置详情（用于编辑回显）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignConfigById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignConfigById() throws FLException {

		quotationAssignConfig = quotationAssignConfigService.queryQuotationAssignConfigById(quotationAssignConfig);

		return SUCCESS;
	}

	/**
	 * 新增配置
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "createQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.createQuotationAssignConfig(quotationAssignConfig);

		return SUCCESS;
	}

	/**
	 * 更新配置
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.updateQuotationAssignConfig(quotationAssignConfig);

		return SUCCESS;
	}

	/**
	 * 删除配置
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "deleteQuotationAssignConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignConfig() throws FLException {

		quotationAssignConfigService.deleteQuotationAssignConfig(quotationAssignConfig);

		return SUCCESS;
	}

	/**
	 * 启用/禁用配置
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfigForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfigForStatus() throws FLException {

		// 调用 Service 更新
		quotationAssignConfigService.updateQuotationAssignConfigForStatus(quotationAssignConfig);

		return SUCCESS;
	}

	/**
	 * 切换自动分配模式
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfigForAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfigForAssign() throws FLException {

		quotationAssignConfigService.updateQuotationAssignConfigForAssign(quotationAssignConfig);

		return SUCCESS;
	}

	public QuotationAssignConfigVO getQuotationAssignConfig() {
		return quotationAssignConfig;
	}

	public void setQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfig) {
		this.quotationAssignConfig = quotationAssignConfig;
	}

}

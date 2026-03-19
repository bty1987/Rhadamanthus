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

import java.util.HashMap;
import java.util.Map;

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
import com.fanglin.utils.Paging;

/**
 * 预算配置表 Action 控制器
 *
 * <p>职责：处理预算配置管理的 HTTP 请求</p>
 *
 * <p>主要功能：</p>
 * <ul>
 *   <li>分页查询配置列表</li>
 *   <li>查询配置详情</li>
 *   <li>新增、编辑、删除配置</li>
 *   <li>启用/禁用配置</li>
 *   <li>切换自动分配模式</li>
 * </ul>
 *
 * @author bty1987
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignConfigAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignConfigService quotationAssignConfigService;

	/**
	 * 配置对象（用于接收前端参数）
	 */
	private QuotationAssignConfigVO config;

	/**
	 * 分页查询配置列表
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String pageQuotationAssignConfig() throws FLException {
		try {
			// 获取分页参数
			Paging paging = getPaging();

			// 获取公司筛选参数
			Integer company = getInteger("company");

			// 调用 Service 查询
			quotationAssignConfigService.pageQuotationAssignConfig(paging, company);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 查询配置详情（用于编辑回显）
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignConfigById", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String queryQuotationAssignConfigById() throws FLException {
		try {
			// 获取配置ID
			long qacid = getLong("qacid");

			// 调用 Service 查询
			config = quotationAssignConfigService.queryQuotationAssignConfigById(qacid);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 新增配置
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "createQuotationAssignConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String createQuotationAssignConfig() throws FLException {
		try {
			// 调用 Service 创建
			quotationAssignConfigService.createQuotationAssignConfig(config);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 更新配置
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfig() throws FLException {
		try {
			// 调用 Service 更新
			quotationAssignConfigService.updateQuotationAssignConfig(config);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 删除配置
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "deleteQuotationAssignConfig", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String deleteQuotationAssignConfig() throws FLException {
		try {
			// 封装成 VO
			config = new QuotationAssignConfigVO();
			config.setQacid(getLong("qacid"));

			// 调用 Service 删除
			quotationAssignConfigService.deleteQuotationAssignConfig(config);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 启用/禁用配置
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfigForStatus", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfigForStatus() throws FLException {
		try {
			// 封装成 VO
			config = new QuotationAssignConfigVO();
			config.setQacid(getLong("qacid"));
			config.setEnabled(getShort("enabled"));

			// 调用 Service 更新
			quotationAssignConfigService.updateQuotationAssignConfigForStatus(config);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	/**
	 * 切换自动分配模式
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignConfigForAssign", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String updateQuotationAssignConfigForAssign() throws FLException {
		try {
			// 封装成 VO
			config = new QuotationAssignConfigVO();
			config.setQacid(getLong("qacid"));
			config.setAutoAssign(getShort("autoAssign"));

			// 调用 Service 更新
			quotationAssignConfigService.updateQuotationAssignConfigForAssign(config);

			return SUCCESS;
		} catch (Exception e) {
			return ERROR;
		}
	}

	// ==================== Getter/Setter ====================

	/**
	 * 获取配置对象
	 *
	 * @return 配置对象
	 */
	public QuotationAssignConfigVO getConfig() {
		return config;
	}

	/**
	 * 设置配置对象
	 *
	 * @param config 配置对象
	 */
	public void setConfig(QuotationAssignConfigVO config) {
		this.config = config;
	}
}

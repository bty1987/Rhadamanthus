/**
 * @File Name     : QuotationAssignUserRuleAction.java
 * @Package      : com.fanglin.quotation.action
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Action 控制器
 */

package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.exception.FLException;
import com.fanglin.quotation.service.QuotationAssignUserRuleService;
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
 * <li>分页查询预算员规则列表</li>
 * <li>查询规则详情（编辑回显）</li>
 * <li>新增、编辑、删除规则</li>
 * <li>启用/停止预算员</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = 9067044185640315560L;

	@Autowired
	private QuotationAssignUserRuleService quotationAssignUserRuleService;

	/**
	 * 预算员规则对象（用于接收前端参数）
	 */
	private QuotationAssignUserRuleVO quotationAssignUserRule;

	/**
	 * 分页查询预算员规则列表
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.pageQuotationAssignUserRule(getPage(), getFilters());

		return SUCCESS;
	}

	/**
	 * 查询规则详情（用于编辑回显）
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignUserRuleById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignUserRuleById() throws FLException {

		quotationAssignUserRule = quotationAssignUserRuleService.queryQuotationAssignUserRuleById(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 新增预算员规则
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "createQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.createQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 更新预算员规则
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.updateQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 删除预算员规则
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "deleteQuotationAssignUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationAssignUserRule() throws FLException {

		quotationAssignUserRuleService.deleteQuotationAssignUserRule(quotationAssignUserRule);

		return SUCCESS;
	}

	/**
	 * 启用/停止预算员
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "updateQuotationAssignUserRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationAssignUserRuleForStatus() throws FLException {

		// 调用 Service 更新状态
		quotationAssignUserRuleService.updateQuotationAssignUserRuleForStatus(quotationAssignUserRule);

		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public QuotationAssignUserRuleVO getQuotationAssignUserRule() {
		return quotationAssignUserRule;
	}

	public void setQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) {
		this.quotationAssignUserRule = quotationAssignUserRule;
	}

}

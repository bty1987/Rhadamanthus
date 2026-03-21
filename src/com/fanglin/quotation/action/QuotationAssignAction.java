/**
 * @File Name     : QuotationAssignAction.java
 * @Package      : com.fanglin.quotation.action
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 核心分配逻辑 Action 控制器
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
import com.fanglin.quotation.service.QuotationAssignService;
import com.fanglin.quotation.vo.QuotationAssignVO;

/**
 * 核心分配逻辑 Action 控制器
 *
 * <p>
 * 职责：处理报价员预算员分配的 HTTP 请求
 * </p>
 *
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>正向自动分配（设计师发起）</li>
 * <li>手动分配（预算经理派单）</li>
 * <li>重新分配（更换预算员）</li>
 * <li>完成报价单触发反向自动分配</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationAssignService quotationAssignService;

	/**
	 * 分配请求VO
	 */
	private QuotationAssignVO quotationAssignVO;

	/**
	 * 正向自动分配（设计师发起）
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "autoQuotationAssign", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String autoQuotationAssign() throws FLException {
		quotationAssignService.autoQuotationAssign(quotationAssignVO);
		return SUCCESS;
	}

	/**
	 * 手动分配报价员（预算经理派单）
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "manualQuotationAssign", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String manualQuotationAssign() throws FLException {
		quotationAssignService.manualQuotationAssign(quotationAssignVO);
		return SUCCESS;
	}

	/**
	 * 重新分配报价员（更换预算员）
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "reassignQuotationAssign", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String reassignQuotationAssign() throws FLException {
		quotationAssignService.reassignQuotationAssign(quotationAssignVO);
		return SUCCESS;
	}

	/**
	 * 完成报价单后触发反向自动分配
	 *
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "finishQuotationAssign", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }),
			@Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" })
	}, params = { "contentType", "text/html" })
	public String finishQuotationAssign() throws FLException {
		quotationAssignService.finishQuotationAssign(quotationAssignVO);
		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public QuotationAssignVO getQuotationAssignVO() {
		return quotationAssignVO;
	}

	public void setQuotationAssignVO(QuotationAssignVO quotationAssignVO) {
		this.quotationAssignVO = quotationAssignVO;
	}
}

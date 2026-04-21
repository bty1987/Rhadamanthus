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

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignAction extends BaseListAction {

	private static final long serialVersionUID = -3957695971001710906L;

	@Autowired
	private QuotationAssignService quotationAssignService;

	/**
	 * 分配请求VO
	 */
	private QuotationAssignVO quotationAssign;

	/**
	 * 正向自动分配（设计师发起）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "autoQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String autoQuotationAssign() throws FLException {

		if (quotationAssign == null) {
			return ERROR;
		}

		quotationAssignService.autoQuotationAssign(quotationAssign);

		return SUCCESS;
	}

	/**
	 * 手动分配报价员（预算经理派单）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "manualQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String manualQuotationAssign() throws FLException {

		if (quotationAssign == null) {
			return ERROR;
		}

		quotationAssignService.manualQuotationAssign(quotationAssign, queryUserId());

		return SUCCESS;
	}

	/**
	 * 重新分配报价员（更换预算员）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "reassignQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reassignQuotationAssign() throws FLException {

		if (quotationAssign == null) {
			return ERROR;
		}

		quotationAssignService.reassignQuotationAssign(quotationAssign, queryUserId());

		return SUCCESS;
	}

	/**
	 * 完成报价单后触发反向自动分配
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "finishQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishQuotationAssign() throws FLException {

		if (quotationAssign == null) {
			return ERROR;
		}

		quotationAssignService.finishQuotationAssign(quotationAssign);

		return SUCCESS;
	}

	/**
	 * 转交报价员（预算员将任务转交给其他预算员）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "transferQuotationAssign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String transferQuotationAssign() throws FLException {

		if (quotationAssign == null) {
			return ERROR;
		}

		quotationAssignService.transferQuotationAssign(quotationAssign, queryUserId());

		return SUCCESS;
	}

	public QuotationAssignVO getQuotationAssign() {
		return quotationAssign;
	}

	public void setQuotationAssign(QuotationAssignVO quotationAssign) {
		this.quotationAssign = quotationAssign;
	}
}

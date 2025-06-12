package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationRefundService;
import com.fanglin.quotation.vo.QuotationRefundVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationRefundAction extends BaseListAction {

	private static final long serialVersionUID = -454049085051751042L;

	@Autowired
	private QuotationRefundService quotationRefundService;

	private QuotationRefundVO quotationRefund;

	private List<QuotationRefundVO> quotationRefunds;

	@Action(value = "pageQuotationRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationRefund() throws FLException {

		quotationRefundService.pageQuotationRefund(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQuotationRefundById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationRefundById() throws FLException {

		quotationRefund = quotationRefundService.queryQuotationRefundById(quotationRefund);

		return SUCCESS;
	}

	@Action(value = "addQuotationRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationRefund() throws FLException {

		quotationRefundService.addQuotationRefund(quotationRefund, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateQuotationRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationRefund() throws FLException {

		quotationRefundService.updateQuotationRefund(quotationRefund);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationRefund", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationRefund() throws FLException {

		quotationRefundService.deleteQuotationRefund(quotationRefund);

		return SUCCESS;
	}

	public QuotationRefundVO getQuotationRefund() {
		return quotationRefund;
	}

	public void setQuotationRefund(QuotationRefundVO quotationRefund) {
		this.quotationRefund = quotationRefund;
	}

	public List<QuotationRefundVO> getQuotationRefunds() {
		return quotationRefunds;
	}

	public void setQuotationRefunds(List<QuotationRefundVO> quotationRefunds) {
		this.quotationRefunds = quotationRefunds;
	}
}

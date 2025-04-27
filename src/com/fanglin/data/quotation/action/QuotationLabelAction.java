package com.fanglin.data.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationLabelService;
import com.fanglin.data.quotation.vo.QuotationLabelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationLabelAction extends BaseListAction {

	private static final long serialVersionUID = -4947537563826631700L;

	@Autowired
	private QuotationLabelService quotationLabelService;

	private QuotationLabelVO quotationLabel;

	@Action(value = "pageQuotationLabel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationLabel() throws FLException {

		quotationLabelService.pageQuotationLabel(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addQuotationLabel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationLabel() throws FLException {

		quotationLabelService.addQuotationLabel(quotationLabel);

		return SUCCESS;
	}

	@Action(value = "updateQuotationLabel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationLabel() throws FLException {

		quotationLabelService.updateQuotationLabel(quotationLabel);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationLabel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationLabel() throws FLException {

		quotationLabelService.deleteQuotationLabel(quotationLabel);

		return SUCCESS;
	}

	public QuotationLabelVO getQuotationLabel() {
		return quotationLabel;
	}

	public void setQuotationLabel(QuotationLabelVO quotationLabel) {
		this.quotationLabel = quotationLabel;
	}
}

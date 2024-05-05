package com.fanglin.data.quotation.action;

import java.text.ParseException;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationPriceService;
import com.fanglin.data.quotation.vo.QuotationPriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationPriceAction extends BaseListAction {

	private static final long serialVersionUID = -1485447390765480381L;

	@Autowired
	private QuotationPriceService quotationPriceService;

	private QuotationPriceVO quotationPrice;

	@Action(value = "pageQuotationPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationPrice() throws FLException {

		quotationPriceService.pageQuotationPrice(getPaging(), getFilters(), quotationPrice);

		return SUCCESS;
	}

	@Action(value = "addQuotationPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationPrice() throws FLException {

		quotationPriceService.addQuotationPrice(quotationPrice);

		return SUCCESS;
	}

	@Action(value = "updateQuotationPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationPrice() throws FLException, ParseException {

		quotationPriceService.updateQuotationPrice(quotationPrice);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationPrice() throws FLException {

		quotationPriceService.deleteQuotationPrice(quotationPrice);

		return SUCCESS;
	}

	public QuotationPriceVO getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(QuotationPriceVO quotationPrice) {
		this.quotationPrice = quotationPrice;
	}

}

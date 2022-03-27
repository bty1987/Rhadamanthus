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
import com.fanglin.quotation.service.QuotationNormriceItemService;
import com.fanglin.quotation.vo.QuotationNormriceItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationNormriceItemAction extends BaseListAction {

	private static final long serialVersionUID = -5489550634835403987L;

	@Autowired
	private QuotationNormriceItemService quotationNormriceItemService;

	private QuotationNormriceItemVO quotationNormriceItem;

	private List<QuotationNormriceItemVO> quotationNormriceItems;

	@Action(value = "queryQuotationNormriceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormoodItem() {

		quotationNormriceItems = quotationNormriceItemService.queryQuotationNormrice(quotationNormriceItem);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationNormriceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationNormoodItem() throws FLException {

		quotationNormriceItemService.deleteQuotationNormriceItem(quotationNormriceItem);

		return SUCCESS;
	}

	public QuotationNormriceItemVO getQuotationNormriceItem() {
		return quotationNormriceItem;
	}

	public void setQuotationNormriceItem(QuotationNormriceItemVO quotationNormriceItem) {
		this.quotationNormriceItem = quotationNormriceItem;
	}

	public List<QuotationNormriceItemVO> getQuotationNormriceItems() {
		return quotationNormriceItems;
	}

	public void setQuotationNormriceItems(List<QuotationNormriceItemVO> quotationNormriceItems) {
		this.quotationNormriceItems = quotationNormriceItems;
	}

}

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
import com.fanglin.quotation.service.QuotationNormoodItemService;
import com.fanglin.quotation.vo.QuotationNormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationNormoodItemAction extends BaseListAction {

	private static final long serialVersionUID = -3174642141430291080L;

	@Autowired
	private QuotationNormoodItemService quotationNormoodItemService;

	private QuotationVO quotation;

	private QuotationNormoodItemVO quotationNormoodItem;

	private List<QuotationNormoodItemVO> quotationNormoodItems;

	@Action(value = "queryQuotationNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormoodItem() {

		quotationNormoodItems = quotationNormoodItemService.queryQuotationNormoodItem(quotationNormoodItem);

		return SUCCESS;
	}

	@Action(value = "addQuotationNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationNormoodItem() throws FLException {

		quotationNormoodItems = quotationNormoodItemService.addQuotationNormoodItem(quotation, quotationNormoodItems);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationNormoodItem() throws FLException {

		quotationNormoodItemService.deleteQuotationNormoodItem(quotationNormoodItem);

		return SUCCESS;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public QuotationNormoodItemVO getQuotationNormoodItem() {
		return quotationNormoodItem;
	}

	public void setQuotationNormoodItem(QuotationNormoodItemVO quotationNormoodItem) {
		this.quotationNormoodItem = quotationNormoodItem;
	}

	public List<QuotationNormoodItemVO> getQuotationNormoodItems() {
		return quotationNormoodItems;
	}

	public void setQuotationNormoodItems(List<QuotationNormoodItemVO> quotationNormoodItems) {
		this.quotationNormoodItems = quotationNormoodItems;
	}

}

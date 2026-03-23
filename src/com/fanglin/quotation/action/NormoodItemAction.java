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
import com.fanglin.quotation.service.NormoodItemService;
import com.fanglin.quotation.vo.NormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormoodItemAction extends BaseListAction {

	private static final long serialVersionUID = -3174642141430291080L;

	@Autowired
	private NormoodItemService normoodItemService;

	private QuotationVO quotation;

	private NormoodItemVO normoodItem;

	private List<NormoodItemVO> normoodItems;

	@Action(value = "queryNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormoodItem() {

		normoodItems = normoodItemService.queryNormoodItem(normoodItem);

		return SUCCESS;
	}

	@Action(value = "addNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormoodItem() throws FLException {

		normoodItems = normoodItemService.addNormoodItem(quotation, normoodItems);

		return SUCCESS;
	}

	@Action(value = "deleteNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormoodItem() throws FLException {

		normoodItemService.deleteNormoodItem(normoodItem);

		return SUCCESS;
	}

	private int amount;

	@Action(value = "amountNormoodItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountNormoodItem() {

		amount = normoodItemService.amountNormoodItem(normoodItem);

		return SUCCESS;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public NormoodItemVO getNormoodItem() {
		return normoodItem;
	}

	public void setNormoodItem(NormoodItemVO normoodItem) {
		this.normoodItem = normoodItem;
	}

	public List<NormoodItemVO> getNormoodItems() {
		return normoodItems;
	}

	public void setNormoodItems(List<NormoodItemVO> normoodItems) {
		this.normoodItems = normoodItems;
	}

}

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
import com.fanglin.quotation.service.NormriceItemService;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormriceItemAction extends BaseListAction {

	private static final long serialVersionUID = -5489550634835403987L;

	@Autowired
	private NormriceItemService normriceItemService;

	private NormriceItemVO normriceItem;

	private QuotationVO quotation;

	private List<NormriceItemVO> normriceItems;

	@Action(value = "queryNormriceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormriceItem() {

		normriceItems = normriceItemService.queryNormriceItem(normriceItem);

		return SUCCESS;
	}

	@Action(value = "addNormriceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormriceItem() throws FLException {

		normriceItemService.addNormriceItem(quotation, normriceItem);
		return SUCCESS;
	}

	@Action(value = "deleteNormriceItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String normriceItems() throws FLException {

		normriceItemService.deleteNormriceItem(normriceItem);

		return SUCCESS;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public NormriceItemVO getNormriceItem() {
		return normriceItem;
	}

	public void setNormriceItem(NormriceItemVO normriceItem) {
		this.normriceItem = normriceItem;
	}

	public List<NormriceItemVO> getNormriceItems() {
		return normriceItems;
	}

	public void setNormriceItems(List<NormriceItemVO> normriceItems) {
		this.normriceItems = normriceItems;
	}

}

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
import com.fanglin.quotation.service.QuotationRefundItemService;
import com.fanglin.quotation.vo.QuotationRefundItemVO;
import com.fanglin.quotation.vo.QuotationRefundVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationRefundItemAction extends BaseListAction {

	private static final long serialVersionUID = -277871510143982548L;

	@Autowired
	private QuotationRefundItemService quotationRefundItemService;

	private QuotationRefundItemVO quotationRefundItem;

	private List<QuotationRefundItemVO> quotationRefundItems;

	private QuotationRefundVO quotationRefund;

	@Action(value = "queryQuotationRefundItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationRefundItem() throws FLException {

		quotationRefundItems = quotationRefundItemService.queryQuotationRefundItem(quotationRefundItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationRefundItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationRefundItem() throws FLException {

		quotationRefundItem = quotationRefundItemService.updateQuotationRefundItem(quotationRefundItem, quotationRefund);

		return SUCCESS;
	}

	@Action(value = "updateQuotationRefundItemForIndex", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationRefundItemForIndex() throws FLException {

		quotationRefundItemService.updateQuotationRefundItemForIndex(quotationRefundItems);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationRefundItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationRefundItem() throws FLException {

		quotationRefundItemService.deleteQuotationRefundItem(quotationRefundItem, quotationRefund);

		return SUCCESS;
	}

	public QuotationRefundItemVO getQuotationRefundItem() {
		return quotationRefundItem;
	}

	public void setQuotationRefundItem(QuotationRefundItemVO quotationRefundItem) {
		this.quotationRefundItem = quotationRefundItem;
	}

	public List<QuotationRefundItemVO> getQuotationRefundItems() {
		return quotationRefundItems;
	}

	public void setQuotationRefundItems(
			List<QuotationRefundItemVO> quotationRefundItems) {
		this.quotationRefundItems = quotationRefundItems;
	}

	public QuotationRefundVO getQuotationRefund() {
		return quotationRefund;
	}

	public void setQuotationRefund(QuotationRefundVO quotationRefund) {
		this.quotationRefund = quotationRefund;
	}
}

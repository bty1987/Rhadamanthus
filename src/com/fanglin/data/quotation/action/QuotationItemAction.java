/**
 * @File Name		: QuotationItemAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationItemService;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationPriceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationItemAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;

	@Autowired
	private QuotationItemService quotationItemService;

	private QuotationItemVO quotationItem;

	private QuotationPriceVO quotationPrice;

	@Action(value = "pageQuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationItem() throws FLException {

		quotationItemService.pageQuotationItem(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageQuotationItemByVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationItemByVersionId() {

		quotationItemService.pageQuotationItemByVersionId(getPaging(), getFilters(), quotationItem);

		return SUCCESS;
	}

	@Action(value = "pageQuotationItemForPrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationItemForPrice() {

		quotationItemService.pageQuotationItemForPrice(getPaging(), getFilters(), quotationItem, quotationPrice);

		return SUCCESS;
	}

	@Action(value = "queryQuotationItemByItemIdAVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationItemByItemIdAVersionId() throws FLException {

		quotationItem = quotationItemService.queryQuotationItemByItemIdAVersionId(quotationItem);

		return SUCCESS;
	}

	@Action(value = "queryQuotationItemByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationItemByQiid() throws FLException {

		quotationItem = quotationItemService.queryQuotationItemByQiid(quotationItem);

		return SUCCESS;
	}

	@Action(value = "addQuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationItem() throws FLException {

		quotationItemService.addQuotationItem(quotationItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationItem() throws FLException {

		quotationItemService.updateQuotationItem(quotationItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationItemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationItemForStatus() throws FLException {

		quotationItemService.updateQuotationItemForStatus(quotationItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationItemForDiscount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationItemForDiscount() throws FLException {

		quotationItemService.updateQuotationItemForDiscount(quotationItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationItemForFormula", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationItemForFormula() throws FLException {

		quotationItemService.updateQuotationItemForFormula(quotationItem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationItemForCost", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationItemForCost() throws FLException {

		quotationItemService.updateQuotationItemForCost(quotationItem);

		return SUCCESS;
	}

	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}

	public QuotationPriceVO getQuotationPrice() {
		return quotationPrice;
	}

	public void setQuotationPrice(QuotationPriceVO quotationPrice) {
		this.quotationPrice = quotationPrice;
	}

}

package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesDeliveryService;
import com.fanglin.sales.vo.SalesDeliveryItemVO;
import com.fanglin.sales.vo.SalesDeliveryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesDeliveryAction extends BaseListAction {

	private static final long serialVersionUID = 1939309321120554902L;

	@Autowired
	private SalesDeliveryService salesDeliveryService;

	private SalesDeliveryVO salesDelivery;

	private List<SalesDeliveryItemVO> salesDeliveryItems;

	private SalesDeliveryItemVO salesDeliveryItem;

	private String companyType;

	private List<Short> statuses;

	@Action(value = "pageSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesDeliveryItem() throws FLException {

		salesDeliveryService.pageSalesDeliveryItem(getPaging(), getFilters(), queryCompany(), statuses, companyType);

		return SUCCESS;
	}

	@Action(value = "pageSalesDeliveryItemForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesDeliveryItemForSupplier() throws FLException {

		salesDeliveryService.pageSalesDeliveryItemForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany(), companyType);

		return SUCCESS;
	}

	@Action(value = "pageSalesDeliveryItemForInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesDeliveryItemForInstorer() throws FLException {

		salesDeliveryService.pageSalesDeliveryItemForInstorer(getPaging(), getFilters(), queryUserId(), queryCompany(), companyType);

		return SUCCESS;
	}

	@Action(value = "querySalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesDeliveryItem() throws FLException {

		salesDeliveryItems = salesDeliveryService.querySalesDeliveryItem(salesDeliveryItem);

		return SUCCESS;
	}

	@Action(value = "tranSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranSalesDeliveryItem() throws FLException {

		salesDeliveryService.tranSalesDeliveryItem(salesDeliveryItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkSalesDeliveryItem() throws FLException {

		salesDeliveryService.checkSalesDeliveryItem(salesDeliveryItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSalesDeliveryItem() throws FLException {

		salesDeliveryService.confirmSalesDeliveryItem(salesDeliveryItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishSalesDeliveryItem() throws FLException {

		salesDeliveryService.finishSalesDeliveryItem(salesDeliveryItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deliveSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveSalesDeliveryItem() throws FLException {

		salesDeliveryService.deliveSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesDeliveryItem() throws FLException {

		salesDeliveryService.updateSalesDeliveryItem(salesDeliveryItem);

		return SUCCESS;
	}

	@Action(value = "deliveSalesDelivery", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveSalesDelivery() throws FLException {

		salesDeliveryService.deliveSalesDelivery(salesDelivery, queryUserId());

		return SUCCESS;
	}

	public SalesDeliveryVO getSalesDelivery() {
		return salesDelivery;
	}

	public void setSalesDelivery(SalesDeliveryVO salesDelivery) {
		this.salesDelivery = salesDelivery;
	}

	public List<SalesDeliveryItemVO> getSalesDeliveryItems() {
		return salesDeliveryItems;
	}

	public void setSalesDeliveryItems(List<SalesDeliveryItemVO> salesDeliveryItems) {
		this.salesDeliveryItems = salesDeliveryItems;
	}

	public SalesDeliveryItemVO getSalesDeliveryItem() {
		return salesDeliveryItem;
	}

	public void setSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem) {
		this.salesDeliveryItem = salesDeliveryItem;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}

	public List<Short> getStatuses() {
		return statuses;
	}

	public void setStatuses(List<Short> statuses) {
		this.statuses = statuses;
	}

}

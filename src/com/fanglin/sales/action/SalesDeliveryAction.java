package com.fanglin.sales.action;

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

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesDeliveryAction extends BaseListAction {

	private static final long serialVersionUID = 1939309321120554902L;

	@Autowired
	private SalesDeliveryService salesDeliveryService;

	private SalesDeliveryItemVO salesDeliveryItem;

	@Action(value = "pageSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesDeliveryItem() throws FLException {

		salesDeliveryService.pageSalesDeliveryItem(getPaging(), getFilters(), queryCompany(), salesDeliveryItem);

		return SUCCESS;
	}

	@Action(value = "pageSalesDeliveryItemForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesDeliveryItemForSupplier() throws FLException {

		salesDeliveryService.pageSalesDeliveryItemForSupplier(getPaging(), getFilters(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "tranSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranSalesDeliveryItem() throws FLException {

		salesDeliveryService.tranSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkSalesDeliveryItem() throws FLException {

		salesDeliveryService.checkSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmSalesDeliveryItem() throws FLException {

		salesDeliveryService.confirmSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishSalesDeliveryItem() throws FLException {

		salesDeliveryService.finishSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deliveSalesDeliveryItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveSalesDeliveryItem() throws FLException {

		salesDeliveryService.deliveSalesDeliveryItem(salesDeliveryItem, queryUserId());

		return SUCCESS;
	}
	
	public SalesDeliveryItemVO getSalesDeliveryItem() {
		return salesDeliveryItem;
	}

	public void setSalesDeliveryItem(SalesDeliveryItemVO salesDeliveryItem) {
		this.salesDeliveryItem = salesDeliveryItem;
	}

}

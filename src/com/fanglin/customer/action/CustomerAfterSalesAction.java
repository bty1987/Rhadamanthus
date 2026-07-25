package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerAfterSalesService;
import com.fanglin.customer.vo.CustomerAfterSalesRecordVO;
import com.fanglin.customer.vo.CustomerAfterSalesRefVO;
import com.fanglin.customer.vo.CustomerAfterSalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerAfterSalesAction extends BaseListAction {

	private static final long serialVersionUID = -3968210680281825077L;

	@Autowired
	private CustomerAfterSalesService customerAfterSalesService;

	private CustomerAfterSalesVO customerAfterSales;

	private List<CustomerAfterSalesVO> customerAfterSaleses;

	private CustomerAfterSalesRecordVO customerAfterSalesRecord;

	private List<CustomerAfterSalesRecordVO> customerAfterSalesRecords;

	private CustomerAfterSalesRefVO customerAfterSalesRef;

	private List<CustomerAfterSalesRefVO> customerAfterSalesRefs;

	@Action(value = "pageCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerAfterSales() throws FLException {

		customerAfterSalesService.pageCustomerAfterSales(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerAfterSalesByAsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAfterSalesByAsid() throws FLException {

		customerAfterSales = customerAfterSalesService.queryCustomerAfterSalesByAsid(customerAfterSales);

		return SUCCESS;
	}

	@Action(value = "queryCustomerAfterSalesByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAfterSalesByOrderId() throws FLException {

		customerAfterSaleses = customerAfterSalesService.queryCustomerAfterSalesByOrderId(customerAfterSales, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerAfterSalesByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAfterSalesByCid() throws FLException {

		customerAfterSaleses = customerAfterSalesService.queryCustomerAfterSalesByCid(customerAfterSales, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerAfterSales() throws FLException {

		customerAfterSalesService.addCustomerAfterSales(customerAfterSales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "receiveCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveCustomerAfterSales() throws FLException {

		customerAfterSalesService.receiveCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "handleCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleCustomerAfterSales() throws FLException {

		customerAfterSalesService.handleCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "dispatchCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String dispatchCustomerAfterSales() throws FLException {

		customerAfterSalesService.dispatchCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "tranCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranCustomerAfterSales() throws FLException {

		customerAfterSalesService.tranCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "holdCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String holdCustomerAfterSales() throws FLException {

		customerAfterSalesService.holdCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "upgradeCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upgradeCustomerAfterSales() throws FLException {

		customerAfterSalesService.upgradeCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishCustomerAfterSales() throws FLException {

		customerAfterSalesService.finishCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "closeCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String closeCustomerAfterSales() throws FLException {

		customerAfterSalesService.closeCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "cancelCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelCustomerAfterSales() throws FLException {

		customerAfterSalesService.cancelCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "reopenCustomerAfterSales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String reopenCustomerAfterSales() throws FLException {

		customerAfterSalesService.reopenCustomerAfterSales(customerAfterSales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryCustomerAfterSalesRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAfterSalesRecord() throws FLException {

		customerAfterSalesRecords = customerAfterSalesService.queryCustomerAfterSalesRecord(customerAfterSalesRecord);

		return SUCCESS;
	}

	@Action(value = "addCustomerAfterSalesRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerAfterSalesRecord() throws FLException {

		customerAfterSalesService.addCustomerAfterSalesRecord(customerAfterSalesRecord, queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryCustomerAfterSalesRef", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerAfterSalesRef() throws FLException {

		customerAfterSalesRefs = customerAfterSalesService.queryCustomerAfterSalesRef(customerAfterSalesRef);

		return SUCCESS;
	}

	@Action(value = "addCustomerAfterSalesRef", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerAfterSalesRef() throws FLException {

		customerAfterSalesService.addCustomerAfterSalesRef(customerAfterSalesRef);

		return SUCCESS;
	}

	public CustomerAfterSalesVO getCustomerAfterSales() {
		return customerAfterSales;
	}

	public void setCustomerAfterSales(CustomerAfterSalesVO customerAfterSales) {
		this.customerAfterSales = customerAfterSales;
	}

	public List<CustomerAfterSalesVO> getCustomerAfterSaleses() {
		return customerAfterSaleses;
	}

	public void setCustomerAfterSaleses(List<CustomerAfterSalesVO> customerAfterSaleses) {
		this.customerAfterSaleses = customerAfterSaleses;
	}

	public CustomerAfterSalesRecordVO getCustomerAfterSalesRecord() {
		return customerAfterSalesRecord;
	}

	public void setCustomerAfterSalesRecord(CustomerAfterSalesRecordVO customerAfterSalesRecord) {
		this.customerAfterSalesRecord = customerAfterSalesRecord;
	}

	public List<CustomerAfterSalesRecordVO> getCustomerAfterSalesRecords() {
		return customerAfterSalesRecords;
	}

	public void setCustomerAfterSalesRecords(List<CustomerAfterSalesRecordVO> customerAfterSalesRecords) {
		this.customerAfterSalesRecords = customerAfterSalesRecords;
	}

	public CustomerAfterSalesRefVO getCustomerAfterSalesRef() {
		return customerAfterSalesRef;
	}

	public void setCustomerAfterSalesRef(CustomerAfterSalesRefVO customerAfterSalesRef) {
		this.customerAfterSalesRef = customerAfterSalesRef;
	}

	public List<CustomerAfterSalesRefVO> getCustomerAfterSalesRefs() {
		return customerAfterSalesRefs;
	}

	public void setCustomerAfterSalesRefs(List<CustomerAfterSalesRefVO> customerAfterSalesRefs) {
		this.customerAfterSalesRefs = customerAfterSalesRefs;
	}

}

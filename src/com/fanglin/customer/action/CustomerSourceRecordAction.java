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
import com.fanglin.customer.service.CustomerSourceRecordService;
import com.fanglin.customer.vo.CustomerSourceRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerSourceRecordAction  extends BaseListAction {

	private static final long serialVersionUID = -2611766578556614988L;

	private List<CustomerSourceRecordVO> customerSourceRecords;

	private CustomerSourceRecordVO customerSourceRecord;

	@Autowired
	private CustomerSourceRecordService customerSourceRecordService;

	@Action(value = "pageCustomerSourceRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerSourceRecord() throws FLException {

		customerSourceRecordService.pageCustomerSourceRecord(getPaging(), getFilters(), customerSourceRecord);

		return SUCCESS;
	}

	@Action(value = "queryCustomerSourceRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerSourceRecord() throws FLException {

		customerSourceRecords = customerSourceRecordService.queryCustomerSourceRecord(customerSourceRecord);

		return SUCCESS;
	}

	public List<CustomerSourceRecordVO> getCustomerSourceRecords() {
		return customerSourceRecords;
	}

	public void setCustomerSourceRecords(
			List<CustomerSourceRecordVO> customerSourceRecords) {
		this.customerSourceRecords = customerSourceRecords;
	}

	public CustomerSourceRecordVO getCustomerSourceRecord() {
		return customerSourceRecord;
	}

	public void setCustomerSourceRecord(CustomerSourceRecordVO customerSourceRecord) {
		this.customerSourceRecord = customerSourceRecord;
	}

}

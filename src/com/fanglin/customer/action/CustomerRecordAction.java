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
import com.fanglin.customer.service.CustomerRecordService;
import com.fanglin.customer.vo.CustomerRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerRecordAction extends BaseListAction {

	private static final long serialVersionUID = -2724557151372646063L;

	private List<CustomerRecordVO> customerRecords;

	private CustomerRecordVO customerRecord;

	@Autowired
	private CustomerRecordService customerRecordService;

	@Action(value = "queryCustomerRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerRecord() throws FLException {

		customerRecords = customerRecordService.queryCustomerRecord(customerRecord);

		return SUCCESS;
	}

	@Action(value = "addCustomerRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerRecord() throws FLException {

		customerRecordService.addCustomerRecord(customerRecord, queryUserId());

		return SUCCESS;
	}

	public List<CustomerRecordVO> getCustomerRecords() {
		return customerRecords;
	}

	public void setCustomerRecords(List<CustomerRecordVO> customerRecords) {
		this.customerRecords = customerRecords;
	}

	public CustomerRecordVO getCustomerRecord() {
		return customerRecord;
	}

	public void setCustomerRecord(CustomerRecordVO customerRecord) {
		this.customerRecord = customerRecord;
	}

}

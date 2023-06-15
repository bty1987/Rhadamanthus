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
import com.fanglin.customer.service.CustomerOriginRecordService;
import com.fanglin.customer.vo.CustomerOriginRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerOriginRecordAction extends BaseListAction {

	private static final long serialVersionUID = -2724557151372646063L;

	private List<CustomerOriginRecordVO> customerOriginRecords;

	private CustomerOriginRecordVO customerOriginRecord;

	@Autowired
	private CustomerOriginRecordService customerOriginRecordService;

	@Action(value = "queryCustomerOriginRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerOriginRecord() throws FLException {

		customerOriginRecords = customerOriginRecordService.queryCustomerOriginRecord(customerOriginRecord);

		return SUCCESS;
	}

	@Action(value = "addCustomerOriginRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerOriginRecord() throws FLException {

		customerOriginRecordService.addCustomerOriginRecord(customerOriginRecord, queryUserId());

		return SUCCESS;
	}

	public List<CustomerOriginRecordVO> getCustomerOriginRecords() {
		return customerOriginRecords;
	}

	public void setCustomerOriginRecords(List<CustomerOriginRecordVO> customerOriginRecords) {
		this.customerOriginRecords = customerOriginRecords;
	}

	public CustomerOriginRecordVO getCustomerOriginRecord() {
		return customerOriginRecord;
	}

	public void setCustomerOriginRecord(CustomerOriginRecordVO customerOriginRecord) {
		this.customerOriginRecord = customerOriginRecord;
	}

}

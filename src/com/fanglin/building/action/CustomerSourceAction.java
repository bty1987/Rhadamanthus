package com.fanglin.building.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.CustomerSourceService;
import com.fanglin.building.vo.CustomerSourceVO;
import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerSourceAction extends BaseListAction{

	private static final long serialVersionUID = 369283426907698983L;
	
	@Autowired
	private CustomerSourceService customerSourceService;
	
	private CustomerSourceVO customerSource;
	
	private List<KeyValueVO> autoFillCustomerSource;
	
	private List<String> autoFillList;
	
	@Action(value = "pageCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerSource() throws FLException{
		
		customerSourceService.pageCustomerSource(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryCustomerSourceByCsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerSourceByCsid() throws FLException{
		
		customerSource = customerSourceService.queryCustomerSourceByCsid(customerSource);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCustomerSourceByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerSourceByNo() throws FLException{
		
		customerSource = customerSourceService.queryCustomerSourceByNo(customerSource);
		
		return SUCCESS;
	}
	
	@Action(value = "checkCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkCustomerSource() throws FLException{
		
		customerSource = customerSourceService.checkCustomerSource(customerSource);
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerSource() throws FLException{
		
		customerSourceService.addCustomerSource(customerSource, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerSource() throws FLException{
		
		customerSourceService.updateCustomerSource(customerSource);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerSourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerSourceForStatus() throws FLException{
		
		customerSourceService.updateCustomerSourceForStatus(customerSource);
		
		return SUCCESS;
	}

	public CustomerSourceVO getCustomerSource() {
		return customerSource;
	}

	public void setCustomerSource(CustomerSourceVO customerSource) {
		this.customerSource = customerSource;
	}

	public List<KeyValueVO> getAutoFillCustomerSource() {
		if(autoFillCustomerSource == null){
			autoFillCustomerSource = new ArrayList<KeyValueVO>();
		}
		return autoFillCustomerSource;
	}

	public void setAutoFillCustomerSource(List<KeyValueVO> autoFillCustomerSource) {
		this.autoFillCustomerSource = autoFillCustomerSource;
	}

	public List<String> getAutoFillList() {
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}
	
}
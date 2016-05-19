/**
 * @File Name		: CustomerServiceComplaintAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.CustomerServiceComplaintService;
import com.fanglin.construction.vo.CustomerServiceComplaintVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerServiceComplaintAction extends BaseListAction{

	private static final long serialVersionUID = 5321396095604251114L;
	
	@Autowired
	private CustomerServiceComplaintService customerServiceComplaintService;
	
	private CustomerServiceComplaintVO customerServiceComplaint;
	
	private List<String> cscIds;
	
	@Action(value = "pageCustomerServiceComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerServiceComplaint(){
		
		customerServiceComplaintService.pageCustomerServiceComplaintByOrderId(getPaging(), getFilters(), customerServiceComplaint);
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomerServiceComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerServiceComplaint() throws FLException{
		
		customerServiceComplaint.setCreaterId(getUserId());
		customerServiceComplaint.setCreaterName(getUserName());
		
		customerServiceComplaintService.saveOrUpdateCustomerServiceComplaint(customerServiceComplaint);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomerServiceComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerServiceComplaint() throws FLException{
		
		customerServiceComplaint.setOperaterId(getUserId());
		customerServiceComplaint.setOperaterName(getUserName());
		
		customerServiceComplaintService.updateCustomerServiceComplaint(customerServiceComplaint);
		
		return SUCCESS;
	}
	
	@Action(value = "handleCustomerServiceComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleCustomerServiceComplaint() throws FLException{
		
		customerServiceComplaint.setOperaterId(getUserId());
		customerServiceComplaint.setOperaterName(getUserName());
		
		customerServiceComplaintService.handleCustomerServiceComplaint(customerServiceComplaint);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCustomerServiceComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerServiceComplaint(){
		
		customerServiceComplaintService.deleteCustomerServiceComplaints(cscIds);
		
		return SUCCESS;
	}

	public CustomerServiceComplaintVO getCustomerServiceComplaint(){
		return customerServiceComplaint;
	}

	public void setCustomerServiceComplaint(CustomerServiceComplaintVO customerServiceComplaint){
		this.customerServiceComplaint = customerServiceComplaint;
	}

	public List<String> getCscIds(){
		return cscIds;
	}

	public void setCscIds(List<String> cscIds){
		this.cscIds = cscIds;
	}
	
}

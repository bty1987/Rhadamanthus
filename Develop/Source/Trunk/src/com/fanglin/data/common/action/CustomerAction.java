/**
 * Title: CustomerAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.data.common.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.CustomerService;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.payment.vo.PaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerAction extends BaseListAction {

	private static final long serialVersionUID = -2224739825533869496L;
	
	@Autowired
	private CustomerService customerService;

	private CustomerVO customer;
	
	private PaymentVO payment;

	private Set<Integer> customerIds;

	private List<KeyValueVO> autoFillCustomer;

	private List<String> autoFillList;

	private String pinyinName;
	
	private float balanceAdvance;
	
	private float projectAdvance;
	
	private float materialAdvance;
	
	private float zaterialAdvance;

	@Action(value = "pageCustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomer(){
		
		customerService.pageCustomer(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "queryCustomerById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerById(){
		
		customer = customerService.queryCustomerById(customer);
		
		return SUCCESS;
	}

	@Action(value = "queryCustomerForName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerForName(){
		
		List<CustomerVO> customerVOs = customerService.queryCustomerForName(pinyinName);
		
		for(CustomerVO customerVO : customerVOs){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(customerVO.getId()));
			keyValueVO.setValue(customerVO.getCustomerName() + "-" + customerVO.getPhone().split(",")[0]);
			getAutoFillCustomer().add(keyValueVO);
			getAutoFillList().add(customerVO.getCustomerName());
		}
		
		return SUCCESS;
	}
	
	@Action(value="queryCustomerForAdvanceByCustomerId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCustomerForAdvanceByCustomerId(){
		
		List<Float> advances = customerService.queryCustomerForAdvanceByCustomerId(customer);
		
		balanceAdvance = advances.get(0);
		projectAdvance = advances.get(1);
		materialAdvance = advances.get(2);
		zaterialAdvance = advances.get(3);
		
		return SUCCESS;
	}
	
	@Action(value = "checkCustomerForPhone", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkCustomerForPhone(){
		
		customerIds = customerService.checkCustomerForPhone(customer);
		
		return SUCCESS;
	}
	
	public CustomerVO getCustomer(){
		return customer;
	}

	public void setCustomer(CustomerVO customer){
		this.customer = customer;
	}

	public PaymentVO getPayment(){
		return payment;
	}

	public void setPayment(PaymentVO payment){
		this.payment = payment;
	}

	public Set<Integer> getCustomerIds(){
		return customerIds;
	}

	public void setCustomerIds(Set<Integer> customerIds){
		this.customerIds = customerIds;
	}

	public List<KeyValueVO> getAutoFillCustomer(){
		if(autoFillCustomer == null){
			autoFillCustomer = new ArrayList<KeyValueVO>();
		}
		return autoFillCustomer;
	}

	public void setAutoFillCustomer(List<KeyValueVO> autoFillCustomer){
		this.autoFillCustomer = autoFillCustomer;
	}

	public List<String> getAutoFillList(){
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}

	public String getPinyinName(){
		return pinyinName;
	}

	public void setPinyinName(String pinyinName){
		this.pinyinName = pinyinName;
	}

	public float getBalanceAdvance() {
		return balanceAdvance;
	}

	public void setBalanceAdvance(float balanceAdvance) {
		this.balanceAdvance = balanceAdvance;
	}

	public float getProjectAdvance() {
		return projectAdvance;
	}

	public void setProjectAdvance(float projectAdvance) {
		this.projectAdvance = projectAdvance;
	}

	public float getMaterialAdvance() {
		return materialAdvance;
	}

	public void setMaterialAdvance(float materialAdvance) {
		this.materialAdvance = materialAdvance;
	}

	public float getZaterialAdvance() {
		return zaterialAdvance;
	}

	public void setZaterialAdvance(float zaterialAdvance) {
		this.zaterialAdvance = zaterialAdvance;
	}

}

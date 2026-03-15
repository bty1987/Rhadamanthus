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
import com.fanglin.customer.service.CustomerUserRuleItemService;
import com.fanglin.customer.vo.CustomerUserRuleItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerUserRuleItemAction extends BaseListAction {

	private static final long serialVersionUID = -6999418731926705777L;

	@Autowired
	private CustomerUserRuleItemService customerUserRuleItemService;

	private List<CustomerUserRuleItemVO> customerUserRuleItems;

	private CustomerUserRuleItemVO customerUserRuleItem;

	private String pinyinName; // 用于拼音查询

	@Action(value = "queryCustomerUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerUserRuleItem() throws FLException {

		customerUserRuleItems = customerUserRuleItemService.queryCustomerUserRuleItem(customerUserRuleItem);

		return SUCCESS;
	}

	@Action(value = "addCustomerUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerUserRuleItem() throws FLException {

		customerUserRuleItemService.addCustomerUserRuleItem(customerUserRuleItem);

		return SUCCESS;
	}

	@Action(value = "deleteCustomerUserRuleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerUserRuleItem() throws FLException {

		customerUserRuleItemService.deleteCustomerUserRuleItem(customerUserRuleItem);

		return SUCCESS;
	}

	@Action(value = "queryCustomerUserRuleItemByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerUserRuleItemByPinyin() throws FLException {

		customerUserRuleItems = customerUserRuleItemService.queryCustomerUserRuleItemByPinyin(pinyinName);

		return SUCCESS;
	}

	public List<CustomerUserRuleItemVO> getCustomerUserRuleItems() {
		return customerUserRuleItems;
	}

	public void setCustomerUserRuleItems(List<CustomerUserRuleItemVO> customerUserRuleItems) {
		this.customerUserRuleItems = customerUserRuleItems;
	}

	public CustomerUserRuleItemVO getCustomerUserRuleItem() {
		return customerUserRuleItem;
	}

	public void setCustomerUserRuleItem(CustomerUserRuleItemVO customerUserRuleItem) {
		this.customerUserRuleItem = customerUserRuleItem;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

}

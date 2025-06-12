/**
 * @File Name	: CustomerServiceGuaranteeAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
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

import com.fanglin.construction.service.CustomerServiceGuaranteeService;
import com.fanglin.construction.vo.CustomerServiceGuaranteeVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerServiceGuaranteeAction extends BaseListAction {

	private static final long serialVersionUID = 1360606310923789774L;

	@Autowired
	private CustomerServiceGuaranteeService customerServiceGuaranteeService;

	private CustomerServiceGuaranteeVO customerServiceGuarantee;

	private List<String> csgIds;

	@Action(value = "pageCustomerServiceGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerServiceGuarantee() {

		customerServiceGuaranteeService.pageCustomerServiceGuaranteeByOrderId(getPaging(), getFilters(), customerServiceGuarantee);

		return SUCCESS;
	}

	@Action(value = "addCustomerServiceGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerServiceGuarantee() {

		customerServiceGuaranteeService.saveOrUpdateCustomerServiceGuarantee(customerServiceGuarantee);

		return SUCCESS;
	}

	@Action(value = "updateCustomerServiceGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerServiceGuarantee() {

		customerServiceGuaranteeService.updateCustomerServiceGuarantee(customerServiceGuarantee);

		return SUCCESS;
	}

	@Action(value = "deleteCustomerServiceGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomerServiceGuarantee() {

		customerServiceGuaranteeService.deleteCustomerServiceGuarantees(csgIds);

		return SUCCESS;
	}

	public List<String> getCsgIds() {
		return csgIds;
	}

	public void setCsgIds(List<String> csgIds) {
		this.csgIds = csgIds;
	}

}

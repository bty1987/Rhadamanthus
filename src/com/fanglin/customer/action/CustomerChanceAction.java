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
import com.fanglin.customer.service.CustomerChanceService;
import com.fanglin.customer.vo.CustomerChanceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerChanceAction extends BaseListAction {

	private static final long serialVersionUID = -1512449361068568516L;

	@Autowired
	private CustomerChanceService customerChanceService;

	private List<CustomerChanceVO> customerChances;

	private CustomerChanceVO customerChance;

	private DecorationVO decoration;

	private String company;

	private String securityCode;

	private String verifyCode;

	@Action(value = "pageCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerChance() throws FLException {

		customerChanceService.pageCustomerChance(getPaging(), getFilters(), customerChance, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerChance() throws FLException {

		customerChances = customerChanceService.queryCustomerChance(customerChance);

		return SUCCESS;
	}

	@Action(value = "queryCustomerChanceByCcid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerChanceByCcid() throws FLException {

		customerChance = customerChanceService.queryCustomerChanceByCcid(customerChance);

		return SUCCESS;
	}

	@Action(value = "addCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerChance() throws FLException {

		customerChanceService.addCustomerChance(customerChance, queryUserId(), company != null ? CompanyServiceImpl.decode(company) : queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerChance() throws FLException {

		customerChanceService.updateCustomerChance(customerChance);

		return SUCCESS;
	}

	@Action(value = "issueCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String issueCustomerChance() throws FLException {

		customerChanceService.issueCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "disableCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableCustomerChance() throws FLException {

		customerChanceService.disableCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendCustomerChance() throws FLException {

		customerChanceService.sendCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "vodeCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String vodeCustomerChance() throws FLException {

		securityCode = customerChanceService.vodeCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "confirmCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmCustomerChance() throws FLException {

		customerChanceService.confirmCustomerChance(customerChance, securityCode, verifyCode);

		return SUCCESS;
	}

	@Action(value = "changeCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeCustomerChance() throws FLException {

		customerChanceService.changeCustomerChance(decoration, customerChance, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "readCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String readCustomerChance() throws FLException {

		customerChanceService.readCustomerChance(customerChance);

		return SUCCESS;
	}

	@Action(value = "configCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String configCustomerChance() throws FLException {

		customerChanceService.configCustomerChance(customerChance);

		return SUCCESS;
	}

	@Action(value = "fineCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String fineCustomerChance() throws FLException {

		customerChanceService.fineCustomerChance(customerChance, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishCustomerChance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishCustomerChance() throws FLException {

		customerChanceService.finishCustomerChance(decoration, customerChance, queryUserId(), queryCompany());

		return SUCCESS;
	}

	public List<CustomerChanceVO> getCustomerChances() {
		return customerChances;
	}

	public void setCustomerChances(List<CustomerChanceVO> customerChances) {
		this.customerChances = customerChances;
	}

	public CustomerChanceVO getCustomerChance() {
		return customerChance;
	}

	public void setCustomerChance(CustomerChanceVO customerChance) {
		this.customerChance = customerChance;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

}

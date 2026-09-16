package com.fanglin.customer.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CustomerUserRuleService;
import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.po.CrossCompanyRightPO;
import com.fanglin.right.service.CrossCompanyRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomerUserRuleAction extends BaseListAction {

	private static final long serialVersionUID = -6686152596675155874L;

	@Autowired
	private CustomerUserRuleService customerUserRuleService;

	@Autowired
	private CrossCompanyRightService crossCompanyRightService;

	private List<CustomerUserRuleVO> customerUserRules;

	private CustomerUserRuleVO customerUserRule;

	private UserVO user;

	private DepartmentTypeVO departmentType;

	private String pinyinName;

	private List<KeyValueVO> autoFillKeyValue;

	@Action(value = "pageCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerUserRule() throws FLException {

		customerUserRuleService.pageCustomerUserRule(getPaging(), getFilters(), customerUserRule, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerUserRule() throws FLException {

		customerUserRule = customerUserRuleService.queryCustomerUserRule(customerUserRule);

		return SUCCESS;
	}

	@Action(value = "queryCustomerUserRuleByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustomerUserRuleByPinyin() throws FLException {

		List<Integer> companys = crossCompanyRightService.queryCompanysForView(queryUserId(), queryCompany(), CrossCompanyRightPO.MODULE_CUSTOMER_STR);

		packageUserName(customerUserRuleService.queryCustomerUserRuleByPinyin(pinyinName, user, departmentType, companys), companys.size() > 1);

		return SUCCESS;
	}

	@Action(value = "addCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomerUserRule() throws FLException {

		customerUserRuleService.addCustomerUserRule(customerUserRule, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerUserRule() throws FLException {

		customerUserRuleService.updateCustomerUserRule(customerUserRule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateCustomerUserRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomerUserRuleForStatus() throws FLException {

		customerUserRuleService.updateCustomerUserRuleForStatus(customerUserRule, queryUserId());

		return SUCCESS;
	}

	@Action(value = "disableCustomerUserRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableCustomerUserRule() throws FLException {

		customerUserRuleService.disableCustomerUserRule(queryCompany());

		return SUCCESS;
	}

	@Action(value = "disableCustomerUserRuleByCurid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableCustomerUserRuleByCurid() throws FLException {

		customerUserRuleService.disableCustomerUserRuleByCurid(customerUserRule);

		return SUCCESS;
	}

	public List<CustomerUserRuleVO> getCustomerUserRules() {
		return customerUserRules;
	}

	public void setCustomerUserRules(List<CustomerUserRuleVO> customerUserRules) {
		this.customerUserRules = customerUserRules;
	}

	public CustomerUserRuleVO getCustomerUserRule() {
		return customerUserRule;
	}

	public void setCustomerUserRule(CustomerUserRuleVO customerUserRule) {
		this.customerUserRule = customerUserRule;
	}

	private void packageUserName(List<UserBaseVO> users, boolean crossCompany) {
		for (UserBaseVO userBaseVO : users) {
			KeyValueVO keyValueVO = new KeyValueVO();

			StringBuffer value = new StringBuffer();
			value.append(userBaseVO.getCurrentName());
			value.append("-");
			value.append(userBaseVO.getDept().getName());

			if (crossCompany && userBaseVO.getCompany() != null && userBaseVO.getCompany().length() != 0) {
				value.append("-");
				value.append(userBaseVO.getCompany());
			}

			keyValueVO.setKey(userBaseVO.getUserId());
			keyValueVO.setValue(value.toString());

			getAutoFillKeyValue().add(keyValueVO);
		}
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

}

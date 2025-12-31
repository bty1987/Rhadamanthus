package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.EmemberService;
import com.fanglin.customer.vo.EmemberVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class EmemberAction extends BaseListAction {

	private static final long serialVersionUID = 2772611663435444344L;

	@Autowired
	private EmemberService ememberService;

	private String securityCode;

	private String verifyCode;

	private String phoneCode;

	private String company;

	private EmemberVO emember;

	@Action(value = "queryEmember", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEmember() throws FLException {

		emember = ememberService.queryEmember(emember);

		return SUCCESS;
	}

	@Action(value = "addEmember", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEmember() throws FLException {

		ememberService.addEmember(emember, securityCode, verifyCode, phoneCode, company);

		return SUCCESS;
	}

	@Action(value = "deleteEmember", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteEmember() throws FLException {

		ememberService.deleteEmember(emember);

		return SUCCESS;
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

	public String getPhoneCode() {
		return phoneCode;
	}

	public void setPhoneCode(String phoneCode) {
		this.phoneCode = phoneCode;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public EmemberVO getEmember() {
		return emember;
	}

	public void setEmember(EmemberVO emember) {
		this.emember = emember;
	}

}

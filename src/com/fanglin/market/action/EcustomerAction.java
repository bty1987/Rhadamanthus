package com.fanglin.market.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.EcustomerService;
import com.fanglin.market.vo.EcustomerVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EcustomerAction extends BaseListAction {

	private static final long serialVersionUID = 9066414044394975048L;

	@Autowired
	private EcustomerService ecustomerService;

	private EcustomerVO ecustomer;

	private String securityCode;

	private String verifyCode;

	@Action(value = "pageEcustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEcustomer() {

		ecustomerService.pageEcustomer(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addEcustomer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEcustomer() throws FLException {

		ecustomerService.addEcustomer(ecustomer, securityCode, verifyCode);

		return SUCCESS;
	}

	public EcustomerVO getEcustomer() {
		return ecustomer;
	}

	public void setEcustomer(EcustomerVO ecustomer) {
		this.ecustomer = ecustomer;
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

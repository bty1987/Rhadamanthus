package com.fanglin.system.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.vo.CompanyVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class CommonAction extends BaseListAction {

	private static final long serialVersionUID = -5732285186970766340L;
	
	@Autowired
	private CompanyService companyService;
	
	private CompanyVO company;
	
	private String verifyCode;
	
	private String securityCode;
	
	@Action(value = "createCompany", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String createCompany() throws FLException{

		companyService.createCompany(company, securityCode, verifyCode);
		
		return SUCCESS;
	}

	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	public String getVerifyCode() {
		return verifyCode;
	}

	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}

	public String getSecurityCode() {
		return securityCode;
	}

	public void setSecurityCode(String securityCode) {
		this.securityCode = securityCode;
	}

}

package com.fanglin.market.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.market.service.EcustomerService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EcustomerAction extends BaseListAction {

	private static final long serialVersionUID = 9066414044394975048L;

	@Autowired
	private EcustomerService ecustomerService;

	@Action(value = "pageEcustomer", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String pageEcustomer(){
		
		ecustomerService.pageEcustomer(getPaging(), getFilters());

		return SUCCESS;
	}
	
}

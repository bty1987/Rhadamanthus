package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.ReceiptService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ReceiptAction extends BaseListAction {
	
	private static final long serialVersionUID = 5417366013881410890L;

	@Autowired
	private ReceiptService receiptService;
	
	@Action(value = "pageReceipt", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageReceipt() throws FLException{
		
		receiptService.pageReceipt(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

}

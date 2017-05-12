package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.payment.service.SalesReceiptService;
import com.fanglin.payment.vo.SalesReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesReceiptAction extends BaseListAction {

	private static final long serialVersionUID = -3828177395916442166L;

	@Autowired
	private SalesReceiptService salesReceiptService;
	
	private SalesReceiptVO salesReceipt;

	@Action(value = "querySalesReceiptBySrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesReceiptBySrId(){
		
		salesReceipt = salesReceiptService.querySalesReceiptBySrId(salesReceipt);
		
		return SUCCESS;
	}
	
	public SalesReceiptVO getSalesReceipt() {
		return salesReceipt;
	}

	public void setSalesReceipt(SalesReceiptVO salesReceipt) {
		this.salesReceipt = salesReceipt;
	}
	
}

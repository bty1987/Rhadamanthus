package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.payment.service.OalesReceiptService;
import com.fanglin.payment.vo.OalesReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesReceiptAction extends BaseListAction {

	private static final long serialVersionUID = -3828177395916442166L;

	@Autowired
	private OalesReceiptService oalesReceiptService;

	private OalesReceiptVO oalesReceipt;

	@Action(value = "queryOalesReceiptByOrId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesReceiptByOrId() {

		oalesReceipt = oalesReceiptService.queryOalesReceiptByOrId(oalesReceipt);

		return SUCCESS;
	}

	public OalesReceiptVO getOalesReceipt() {
		return oalesReceipt;
	}

	public void setOalesReceipt(OalesReceiptVO oalesReceipt) {
		this.oalesReceipt = oalesReceipt;
	}

}

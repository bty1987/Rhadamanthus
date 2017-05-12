package com.fanglin.inventory.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.inventory.service.RefundsItemService;
import com.fanglin.inventory.vo.RefundsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RefundsAction extends BaseListAction {
	
	private static final long serialVersionUID = 3474050727800940828L;
	
	@Autowired
	private RefundsItemService  refundsItemService;
	
	private RefundsVO  refunds;
	
	@Action(value = "queryRefundsItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
		public String queryRefundsItemBySid(){
			refundsItemService.queryRefundsItemBySid(refunds);
			return SUCCESS;
	}

	public RefundsVO getRefunds() {
		return refunds;
	}

	public void setRefunds(RefundsVO refunds) {
		this.refunds = refunds;
	}


}

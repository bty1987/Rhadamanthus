package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.sales.service.RefundsItemService;
import com.fanglin.sales.vo.RefundsItemVO;
import com.fanglin.sales.vo.RefundsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RefundsAction extends BaseListAction {
	
	private static final long serialVersionUID = 3474050727800940828L;
	
	@Autowired
	private RefundsItemService refundsItemService;
	
	private RefundsVO refunds;
	
	private List<RefundsItemVO>  refundsItems;
	
	@Action(value = "queryRefundsItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
		public String queryRefundsItemBySid(){
			refundsItems = refundsItemService.queryRefundsItemBySid(refunds);
			return SUCCESS;
	}

	public RefundsVO getRefunds() {
		return refunds;
	}

	public void setRefunds(RefundsVO refunds) {
		this.refunds = refunds;
	}

	public List<RefundsItemVO> getRefundsItems() {
		return refundsItems;
	}

	public void setRefundsItems(List<RefundsItemVO> refundsItems) {
		this.refundsItems = refundsItems;
	}

}

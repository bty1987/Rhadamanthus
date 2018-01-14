/**
 * @File Name		: PurchaseAmountAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-10-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.inventory.service.PurchaseAmountService;
import com.fanglin.inventory.vo.PurchaseAmountVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PurchaseAmountAction extends BaseListAction {

	private static final long serialVersionUID = -5369439373143127190L;
	
	@Autowired
	private PurchaseAmountService purchaseAmountService;
	
	private List<PurchaseAmountVO> purchaseAmounts;
	
	@Action(value = "queryPurchaseAmount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseAmount(){
		
		purchaseAmounts = purchaseAmountService.queryPurchaseAmount();
		
		return SUCCESS;
	}

	public List<PurchaseAmountVO> getPurchaseAmounts() {
		return purchaseAmounts;
	}

	public void setPurchaseAmounts(List<PurchaseAmountVO> purchaseAmounts) {
		this.purchaseAmounts = purchaseAmounts;
	}
	
}

/**
 * @File Name		: QuotationAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.service.CustomQuotationItemService;
import com.fanglin.quotation.vo.CustomQuotationItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustomQuotationItemAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Autowired
	private CustomQuotationItemService customQuotationItemService;
	
	private CustomQuotationItemVO customQuotationItem;
	
	@Action(value = "pageCustomerItemByQuotationId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustomerItemByQuotationId(){
		
		customQuotationItemService.pageCustomerItemByQuotationId(getPaging(), getFilters(), customQuotationItem);

		return SUCCESS;
	}

	public CustomQuotationItemVO getCustomQuotationItem() {
		return customQuotationItem;
	}

	public void setCustomQuotationItem(CustomQuotationItemVO customQuotationItem) {
		this.customQuotationItem = customQuotationItem;
	}

}

/**
 * @File Name		: QuotationDetailAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationDetailAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Action(value = "queryQuotationDetailById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationDetailById() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "queryQuotationDetailForAllInfoById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationDetailForAllInfoById() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "addQuotationFunctionAreaByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFunctionAreaByIds() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomQuotationItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomQuotationItem() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomQuotationItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomQuotationItem() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationFunctionAreaItemByUuids", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFunctionAreaItemByUuids() throws FLException{
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCustomQuotationItemByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomQuotationItemByIds(){
		
		return SUCCESS;
	}

}

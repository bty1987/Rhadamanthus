/**
 * @File Name		: SystemDefineItemAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.service.SystemDefineItemService;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SystemDefineItemAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;

	@Autowired
	private SystemDefineItemService systemDefineItemService;

	private SystemDefineItemVO systemDefineItem;

	@Action(value = "pageSystemDefineItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSystemDefineItem() throws FLException {

		systemDefineItemService.pageSystemDefineItem(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageSystemDefineItemForEnable", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSystemDefineItemForEnable() throws FLException {

		getFilters().add(new Filter("status", "1", "eq"));

		systemDefineItemService.pageSystemDefineItem(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySystemDefineItemByItemId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySystemDefineItemByItemIdAndVersionId() throws FLException {

		systemDefineItem = systemDefineItemService.querySystemDefineItemByItemId(systemDefineItem, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addSystemDefineItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSystemDefineItem() throws FLException {

		systemDefineItemService.addSystemDefineItem(systemDefineItem, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSystemDefineItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSystemDefineItem() throws FLException {

		systemDefineItemService.updateSystemDefineItem(systemDefineItem);

		return SUCCESS;
	}

	@Action(value = "updateSystemDefineItemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSystemDefineItemForStatus() throws FLException {

		systemDefineItemService.updateSystemDefineItemForStatus(systemDefineItem);

		return SUCCESS;
	}

	@Action(value = "updateSystemDefineItemForDiscount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSystemDefineItemForDiscount() throws FLException {

		systemDefineItemService.updateSystemDefineItemForDiscount(systemDefineItem);

		return SUCCESS;
	}

	@Action(value = "deleteSystemDefineItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSystemDefineItem() {

		systemDefineItemService.deleteSystemDefineItem(systemDefineItem);

		return SUCCESS;
	}

	public SystemDefineItemVO getSystemDefineItem() {
		return systemDefineItem;
	}

	public void setSystemDefineItem(SystemDefineItemVO systemDefineItem) {
		this.systemDefineItem = systemDefineItem;
	}

}

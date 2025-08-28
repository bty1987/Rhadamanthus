package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.ExtensionItemService;
import com.fanglin.quotation.vo.ExtensionItemVO;
import com.fanglin.quotation.vo.ExtensionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ExtensionItemAction extends BaseListAction {

	private static final long serialVersionUID = -6386024344693340033L;

	@Autowired
	private ExtensionItemService extensionItemService;

	private List<ExtensionItemVO> extensionItems;

	private ExtensionItemVO extensionItem;

	private ExtensionVO extension;

	private List<Long> extensionIds;

	@Action(value = "queryExtensionItemByEid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryExtensionItemByEid() {

		extensionItems = extensionItemService.queryExtensionItemByEid(extensionItem);

		return SUCCESS;
	}

	@Action(value = "queryExtensionItemByEids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryExtensionItemByEids() {

		extensionItems = extensionItemService.queryExtensionItemByEids(extensionIds);

		return SUCCESS;
	}

	@Action(value = "updateExtensionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateExtensionItem() throws FLException {

		extensionItemService.updateExtensionItem(extensionItem, extension);

		return SUCCESS;
	}

	@Action(value = "upgradeExtensionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upgradeExtensionItem() throws FLException {

		extensionItemService.upgradeExtensionItem(extensionItem, extension, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteExtensionItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteExtensionItem() throws FLException {

		extensionItemService.deleteExtensionItem(extensionItem, extension);

		return SUCCESS;
	}

	public List<ExtensionItemVO> getExtensionItems() {
		return extensionItems;
	}

	public void setExtensionItems(List<ExtensionItemVO> extensionItems) {
		this.extensionItems = extensionItems;
	}

	public ExtensionItemVO getExtensionItem() {
		return extensionItem;
	}

	public void setExtensionItem(ExtensionItemVO extensionItem) {
		this.extensionItem = extensionItem;
	}

	public ExtensionVO getExtension() {
		return extension;
	}

	public void setExtension(ExtensionVO extension) {
		this.extension = extension;
	}

	public List<Long> getExtensionIds() {
		return extensionIds;
	}

	public void setExtensionIds(List<Long> extensionIds) {
		this.extensionIds = extensionIds;
	}

}

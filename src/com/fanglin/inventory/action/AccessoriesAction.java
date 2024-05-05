package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.AccessoriesItemService;
import com.fanglin.inventory.service.AccessoriesService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AccessoriesAction extends BaseListAction {

	private static final long serialVersionUID = 4725011827802059146L;

	@Autowired
	private AccessoriesService accessoriesService;

	private AccessoriesVO accessories;

	private List<AccessoriesVO> accessoriess;

	private List<AccessoriesItemVO> accessoriesItems;

	private AccessoriesItemVO accessoriesItem;

	private List<Long> aids;

	@Autowired
	private AccessoriesItemService accessoriesItemService;

	@Action(value = "pageAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAccessories() throws FLException {

		accessoriesService.pageAccessories(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryAccessoriesByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesByOrderId() throws FLException {

		accessoriess = accessoriesService.queryAccessoriesByOrderId(accessories);

		return SUCCESS;
	}

	@Action(value = "addAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAccessories() throws FLException {

		accessoriesService.addAccessories(accessories, accessoriesItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "preoutAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String preoutAccessories() throws FLException {

		accessoriesService.preoutAccessories(accessories, queryUserId());

		return SUCCESS;
	}

	@Action(value = "auditAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String auditAccessories() throws FLException {

		accessoriesService.auditAccessories(accessories);

		return SUCCESS;
	}

	@Action(value = "cancelAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelAccessories() throws FLException {

		accessoriesService.cancelAccessories(accessories, queryUserId());

		return SUCCESS;
	}

	@Action(value = "refuseAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refuseAccessories() throws FLException {

		accessoriesService.refuseAccessories(accessories, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateAccessoriesForPrint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccessoriesForPrint() throws FLException {

		accessoriesService.updateAccessoriesForPrint(accessories);

		return SUCCESS;
	}

	@Action(value = "deliveAccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveAccessories() throws FLException {

		accessoriesService.deliveAccessories(accessories, queryUserId());

		return SUCCESS;
	}

	@Action(value = "queryAccessoriesItemByAid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesItemByAid() {

		accessoriesItems = accessoriesItemService.queryAccessoriesItemByAid(accessoriesItem);

		return SUCCESS;
	}

	@Action(value = "queryAccessoriesItemByAids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesItemByAids() {

		accessoriesItems = accessoriesItemService.queryAccessoriesItemByAids(aids);

		return SUCCESS;
	}

	@Action(value = "queryAccessoriesItemByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAccessoriesItemByOrderId() {

		accessoriesItems = accessoriesItemService.queryAccessoriesItemByOrderId(accessories);

		return SUCCESS;
	}

	@Action(value = "checkAccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkAccessoriesItem() throws FLException {

		accessoriesItemService.checkAccessoriesItem(accessories, accessoriesItem);

		return SUCCESS;
	}

	@Action(value = "addAccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAccessoriesItem() throws FLException {

		accessoriesItemService.addAccessoriesItem(accessories, accessoriesItem);

		return SUCCESS;
	}

	@Action(value = "updateAccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAccessoriesItem() throws FLException {

		accessoriesItemService.updateAccessoriesItem(accessoriesItem);

		return SUCCESS;
	}

	@Action(value = "deleteAccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAccessoriesItem() throws FLException {

		accessoriesItemService.deleteAccessoriesItem(accessoriesItem);

		return SUCCESS;
	}

	public AccessoriesVO getAccessories() {
		return accessories;
	}

	public void setAccessories(AccessoriesVO accessories) {
		this.accessories = accessories;
	}

	public List<AccessoriesItemVO> getAccessoriesItems() {
		return accessoriesItems;
	}

	public void setAccessoriesItems(List<AccessoriesItemVO> accessoriesItems) {
		this.accessoriesItems = accessoriesItems;
	}

	public AccessoriesItemVO getAccessoriesItem() {
		return accessoriesItem;
	}

	public void setAccessoriesItem(AccessoriesItemVO accessoriesItem) {
		this.accessoriesItem = accessoriesItem;
	}

	public List<Long> getAids() {
		return aids;
	}

	public void setAids(List<Long> aids) {
		this.aids = aids;
	}

	public List<AccessoriesVO> getAccessoriess() {
		return accessoriess;
	}

	public void setAccessoriess(List<AccessoriesVO> accessoriess) {
		this.accessoriess = accessoriess;
	}

}

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
import com.fanglin.inventory.service.OccessoriesItemService;
import com.fanglin.inventory.service.OccessoriesService;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OccessoriesAction extends BaseListAction {

	private static final long serialVersionUID = -7886726770040923156L;
	
	@Autowired
	private OccessoriesService occessoriesService;
	
	@Autowired
	private OccessoriesItemService occessoriesItemService;
	
	private OccessoriesVO occessories;
	
	private OccessoriesItemVO occessoriesItem;
	
	private List<OccessoriesItemVO> occessoriesItems;
	
	@Action(value = "pageOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAccessories() throws FLException {

		occessoriesService.pageOccessories(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}
	@Action(value = "pageOccessoriesForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOccessoriesForSupplier() throws FLException {

		occessoriesService.pageOccessoriesForSupplier(getPaging(), getFilters(), queryUserId());

		return SUCCESS;
	}
	@Action(value = "queryOccessoriesItemByAid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOccessoriesItemByAid() throws FLException {

		occessoriesItems = occessoriesItemService.queryOccessoriesItemByAid(occessoriesItem);

		return SUCCESS;
	}
	
	@Action(value = "addOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessories() throws FLException {

		occessoriesService.addOccessories(occessories, occessoriesItems, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "addOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessoriesItem() throws FLException {

		occessoriesItemService.addOccessoriesItem(occessories, occessoriesItem);

		return SUCCESS;
	}
	
	@Action(value = "bindOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindOccessories() throws FLException {

		occessoriesService.bindOccessories(occessories);

		return SUCCESS;
	}
	
	@Action(value = "updateOccessoriesForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOccessoriesForStatus() throws FLException {

		occessoriesService.updateOccessoriesForStatus(occessories);

		return SUCCESS;
	}
	
	@Action(value = "confirmOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmOccessories() throws FLException {

		occessoriesService.confirmOccessories(occessories,queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "balanceOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceOccessories() throws FLException {

		occessoriesService.balanceOccessories(occessories,queryUserId());

		return SUCCESS;
	}
	
	
	@Action(value = "updateOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOccessoriesItem() throws FLException {

		occessoriesItemService.updateOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}
	
	@Action(value = "refundOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundOccessoriesItem() throws FLException {

		occessoriesItemService.refundOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}
	
	
	@Action(value = "deleteOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOccessoriesItem() throws FLException {

		occessoriesItemService.deleteOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}

	public OccessoriesVO getOccessories() {
		return occessories;
	}

	public void setOccessories(OccessoriesVO occessories) {
		this.occessories = occessories;
	}

	public OccessoriesItemVO getOccessoriesItem() {
		return occessoriesItem;
	}

	public void setOccessoriesItem(OccessoriesItemVO occessoriesItem) {
		this.occessoriesItem = occessoriesItem;
	}

	public List<OccessoriesItemVO> getOccessoriesItems() {
		return occessoriesItems;
	}

	public void setOccessoriesItems(List<OccessoriesItemVO> occessoriesItems) {
		this.occessoriesItems = occessoriesItems;
	}

}

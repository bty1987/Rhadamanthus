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
import com.fanglin.inventory.vo.OccessoriesItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OccessoriesItemAction extends BaseListAction {

	private static final long serialVersionUID = 5509552559378566105L;

	@Autowired
	private OccessoriesItemService occessoriesItemService;

	private OccessoriesItemVO occessoriesItem;

	private List<OccessoriesItemVO> occessoriesItems;

	private OccessoriesVO occessories;

	@Action(value = "queryOccessoriesItemByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOccessoriesItemByOid() throws FLException {

		occessoriesItems = occessoriesItemService.queryOccessoriesItemByOid(occessoriesItem);

		return SUCCESS;
	}

	@Action(value = "addOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessoriesItem() throws FLException {

		occessoriesItemService.addOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}

	@Action(value = "updateOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOccessoriesItem() throws FLException {

		occessoriesItemService.updateOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}

	@Action(value = "deleteOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOccessoriesItem() throws FLException {

		occessoriesItemService.deleteOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}

	private int amount;

	@Action(value = "amountOccessoriesItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountOccessoriesItem() {

		amount = occessoriesItemService.amountOccessoriesItem(occessoriesItem);

		return SUCCESS;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
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

	public OccessoriesVO getOccessories() {
		return occessories;
	}

	public void setOccessories(OccessoriesVO occessories) {
		this.occessories = occessories;
	}

}

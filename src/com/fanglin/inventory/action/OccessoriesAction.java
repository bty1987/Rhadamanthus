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

	private OccessoriesVO occessories;

	private List<OccessoriesItemVO> occessoriesItems;

	@Action(value = "pageOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAccessories() throws FLException {

		occessoriesService.pageOccessories(getPaging(), getFilters(), queryCompany(), occessories);

		return SUCCESS;
	}

	@Action(value = "pageOccessoriesForSupplier", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOccessoriesForSupplier() throws FLException {

		occessoriesService.pageOccessoriesForSupplier(getPaging(), getFilters(), queryUserId(), occessories);

		return SUCCESS;
	}

	@Action(value = "queryOccessoriesByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOccessoriesByOid() throws FLException {

		occessories = occessoriesService.queryOccessoriesByOid(occessories);

		return SUCCESS;
	}

	@Action(value = "addOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOccessories() throws FLException {

		occessoriesService.addOccessories(occessories, occessoriesItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "bindOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindOccessories() throws FLException {

		occessoriesService.bindOccessories(occessories);

		return SUCCESS;
	}

	@Action(value = "balanceOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String balanceOccessories() throws FLException {

		occessoriesService.balanceOccessories(occessories, occessoriesItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deliveOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveOccessories() throws FLException {

		occessoriesService.deliveOccessories(occessories, occessoriesItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "receiveOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveOccessories() throws FLException {

		occessoriesService.receiveOccessories(occessories, occessoriesItems, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishOccessories() throws FLException {

		occessoriesService.finishOccessories(occessories);

		return SUCCESS;
	}

	@Action(value = "rateOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rateOccessories() throws FLException {

		occessoriesService.rateOccessories(occessories);

		return SUCCESS;
	}

	@Action(value = "deleteOccessories", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOccessories() throws FLException {

		occessoriesService.deleteOccessories(occessories);

		return SUCCESS;
	}

	public OccessoriesVO getOccessories() {
		return occessories;
	}

	public void setOccessories(OccessoriesVO occessories) {
		this.occessories = occessories;
	}

	public List<OccessoriesItemVO> getOccessoriesItems() {
		return occessoriesItems;
	}

	public void setOccessoriesItems(List<OccessoriesItemVO> occessoriesItems) {
		this.occessoriesItems = occessoriesItems;
	}

}

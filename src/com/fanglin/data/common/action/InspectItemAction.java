package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.InspectItemService;
import com.fanglin.data.common.vo.InspectItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InspectItemAction extends BaseListAction {

	private static final long serialVersionUID = 5598010359294465599L;

	@Autowired
	private InspectItemService inspectItemService;

	private InspectItemVO inspectItem;

	private List<InspectItemVO> inspectItems;

	@Action(value = "queryInspectItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInspectItem() throws FLException {

		inspectItems = inspectItemService.queryInspectItem(inspectItem);

		return SUCCESS;
	}

	@Action(value = "addInspectItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInspectItem() throws FLException {

		inspectItemService.addInspectItem(inspectItem);

		return SUCCESS;
	}

	@Action(value = "updateInspectItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInspectItem() throws FLException {

		inspectItemService.updateInspectItem(inspectItem);

		return SUCCESS;
	}

	@Action(value = "deleteInspectItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteInspectItem() throws FLException {

		inspectItemService.deleteInspectItem(inspectItem);

		return SUCCESS;
	}

	public InspectItemVO getInspectItem() {
		return inspectItem;
	}

	public void setInspectItem(InspectItemVO inspectItem) {
		this.inspectItem = inspectItem;
	}

	public List<InspectItemVO> getInspectItems() {
		return inspectItems;
	}

	public void setInspectItems(List<InspectItemVO> inspectItems) {
		this.inspectItems = inspectItems;
	}

}

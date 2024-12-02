package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.SelectionItemStatusRightService;
import com.fanglin.right.vo.SelectionItemStatusRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SelectionItemStatusRightAction extends BaseListAction {

	private static final long serialVersionUID = -6807412734080828439L;

	@Autowired
	private SelectionItemStatusRightService selectionItemStatusRightService;

	private List<SelectionItemStatusRightVO> selectionItemStatusRights;

	private SelectionItemStatusRightVO selectionItemStatusRight;

	@Action(value = "querySelectionItemStatusRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesDeliveryStatusRight() throws FLException {

		selectionItemStatusRights = selectionItemStatusRightService.querySelectionItemStatusRight(selectionItemStatusRight);

		return SUCCESS;
	}

	@Action(value = "updateSelectionItemStatusRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesDeliveryStatusRight() throws FLException {

		selectionItemStatusRightService.updateSelectionItemStatusRight(selectionItemStatusRight, selectionItemStatusRights);

		return SUCCESS;
	}

	public List<SelectionItemStatusRightVO> getSelectionItemStatusRights() {
		return selectionItemStatusRights;
	}

	public void setSelectionItemStatusRights(List<SelectionItemStatusRightVO> selectionItemStatusRights) {
		this.selectionItemStatusRights = selectionItemStatusRights;
	}

	public SelectionItemStatusRightVO getSelectionItemStatusRight() {
		return selectionItemStatusRight;
	}

	public void setSelectionItemStatusRight(SelectionItemStatusRightVO selectionItemStatusRight) {
		this.selectionItemStatusRight = selectionItemStatusRight;
	}

}

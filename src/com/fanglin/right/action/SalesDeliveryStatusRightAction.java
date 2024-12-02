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
import com.fanglin.right.service.SalesDeliveryStatusRightService;
import com.fanglin.right.vo.SalesDeliveryStatusRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesDeliveryStatusRightAction extends BaseListAction {

	private static final long serialVersionUID = -6807412734080828439L;

	@Autowired
	private SalesDeliveryStatusRightService salesDeliveryStatusRightService;

	private List<SalesDeliveryStatusRightVO> salesDeliveryStatusRights;

	private SalesDeliveryStatusRightVO salesDeliveryStatusRight;

	@Action(value = "querySalesDeliveryStatusRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesDeliveryStatusRight() throws FLException {

		salesDeliveryStatusRights = salesDeliveryStatusRightService.querySalesDeliveryStatusRight(salesDeliveryStatusRight);

		return SUCCESS;
	}

	@Action(value = "updateSalesDeliveryStatusRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesDeliveryStatusRight() throws FLException {

		salesDeliveryStatusRightService.updateSalesDeliveryStatusRight(salesDeliveryStatusRight, salesDeliveryStatusRights);

		return SUCCESS;
	}

	public List<SalesDeliveryStatusRightVO> getSalesDeliveryStatusRights() {
		return salesDeliveryStatusRights;
	}

	public void setSalesDeliveryStatusRights(List<SalesDeliveryStatusRightVO> salesDeliveryStatusRights) {
		this.salesDeliveryStatusRights = salesDeliveryStatusRights;
	}

	public SalesDeliveryStatusRightVO getSalesDeliveryStatusRight() {
		return salesDeliveryStatusRight;
	}

	public void setSalesDeliveryStatusRight(SalesDeliveryStatusRightVO salesDeliveryStatusRight) {
		this.salesDeliveryStatusRight = salesDeliveryStatusRight;
	}

}

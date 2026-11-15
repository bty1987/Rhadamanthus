package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesPostFollowupService;
import com.fanglin.sales.service.SalesPreFollowupService;
import com.fanglin.sales.vo.SalesPostFollowupVO;
import com.fanglin.sales.vo.SalesPreFollowupVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesFollowupAction extends BaseListAction {

	private static final long serialVersionUID = -5271843069153824765L;

	@Autowired
	private SalesPreFollowupService salesPreFollowupService;

	@Autowired
	private SalesPostFollowupService salesPostFollowupService;

	private SalesPreFollowupVO salesPreFollowup;

	private List<SalesPreFollowupVO> salesPreFollowups;

	private SalesPostFollowupVO salesPostFollowup;

	private List<SalesPostFollowupVO> salesPostFollowups;

	@Action(value = "querySalesPreFollowupByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPreFollowupByOrderId() throws FLException {

		salesPreFollowups = salesPreFollowupService.querySalesPreFollowupByOrderId(salesPreFollowup);

		return SUCCESS;
	}

	@Action(value = "countSalesPreFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countSalesPreFollowup() throws FLException {

		salesPreFollowup = salesPreFollowupService.countSalesPreFollowup(salesPreFollowup);

		return SUCCESS;
	}

	@Action(value = "addSalesPreFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPreFollowup() throws FLException {

		salesPreFollowupService.addSalesPreFollowup(salesPreFollowup, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteSalesPreFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesPreFollowup() throws FLException {

		salesPreFollowupService.deleteSalesPreFollowup(salesPreFollowup, queryUserId());

		return SUCCESS;
	}

	@Action(value = "querySalesPostFollowupBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPostFollowupBySid() throws FLException {

		salesPostFollowups = salesPostFollowupService.querySalesPostFollowupBySid(salesPostFollowup);

		return SUCCESS;
	}

	@Action(value = "countSalesPostFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countSalesPostFollowup() throws FLException {

		salesPostFollowup = salesPostFollowupService.countSalesPostFollowup(salesPostFollowup);

		return SUCCESS;
	}

	@Action(value = "addSalesPostFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPostFollowup() throws FLException {

		salesPostFollowupService.addSalesPostFollowup(salesPostFollowup, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteSalesPostFollowup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesPostFollowup() throws FLException {

		salesPostFollowupService.deleteSalesPostFollowup(salesPostFollowup, queryUserId());

		return SUCCESS;
	}

	public SalesPreFollowupVO getSalesPreFollowup() {
		return salesPreFollowup;
	}

	public void setSalesPreFollowup(SalesPreFollowupVO salesPreFollowup) {
		this.salesPreFollowup = salesPreFollowup;
	}

	public List<SalesPreFollowupVO> getSalesPreFollowups() {
		return salesPreFollowups;
	}

	public void setSalesPreFollowups(List<SalesPreFollowupVO> salesPreFollowups) {
		this.salesPreFollowups = salesPreFollowups;
	}

	public SalesPostFollowupVO getSalesPostFollowup() {
		return salesPostFollowup;
	}

	public void setSalesPostFollowup(SalesPostFollowupVO salesPostFollowup) {
		this.salesPostFollowup = salesPostFollowup;
	}

	public List<SalesPostFollowupVO> getSalesPostFollowups() {
		return salesPostFollowups;
	}

	public void setSalesPostFollowups(List<SalesPostFollowupVO> salesPostFollowups) {
		this.salesPostFollowups = salesPostFollowups;
	}

}

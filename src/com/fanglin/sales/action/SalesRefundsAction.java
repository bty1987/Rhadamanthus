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
import com.fanglin.sales.service.SalesRefundsService;
import com.fanglin.sales.vo.SalesRefundsItemVO;
import com.fanglin.sales.vo.SalesRefundsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesRefundsAction extends BaseListAction {

	private static final long serialVersionUID = 3474050727800940828L;

	@Autowired
	private SalesRefundsService salesRefundsService;

	private SalesRefundsVO refunds;

	private List<SalesRefundsVO> refundses;

	private List<SalesRefundsItemVO> refundsItems;

	private String securityCode;

	private String verifyCode;

	@Action(value = "pageSalesRefunds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalesRefunds() throws FLException {

		salesRefundsService.pageSalesRefunds(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "querySalesRefundsBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesRefundsBySid() {

		refundses = salesRefundsService.querySalesRefundsBySid(refunds);

		return SUCCESS;
	}

	@Action(value = "querySalesRefundsByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesRefundsByRid() {

		refunds = salesRefundsService.querySalesRefundsByRid(refunds);

		return SUCCESS;
	}

	@Action(value = "querySalesRefundsItemBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesRefundsItemBySid() {

		refundsItems = salesRefundsService.querySalesRefundsItemBySid(refunds);

		return SUCCESS;
	}

	@Action(value = "querySalesRefundsItemByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesRefundsItemByRid() {

		refundsItems = salesRefundsService.querySalesRefundsItemByRid(refunds);

		return SUCCESS;
	}

	@Action(value = "sendSalesRefunds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendSalesRefunds() throws FLException {

		salesRefundsService.sendSalesRefunds(refunds, queryUserId());

		return SUCCESS;
	}

	@Action(value = "affirmSalesRefunds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmSalesRefunds() throws FLException {

		salesRefundsService.affirmSalesRefunds(refunds, securityCode, verifyCode);

		return SUCCESS;
	}

	public SalesRefundsVO getRefunds() {
		return refunds;
	}

	public void setRefunds(SalesRefundsVO refunds) {
		this.refunds = refunds;
	}

	public List<SalesRefundsVO> getRefundses() {
		return refundses;
	}

	public void setRefundses(List<SalesRefundsVO> refundses) {
		this.refundses = refundses;
	}

	public List<SalesRefundsItemVO> getRefundsItems() {
		return refundsItems;
	}

	public void setRefundsItems(List<SalesRefundsItemVO> refundsItems) {
		this.refundsItems = refundsItems;
	}

}

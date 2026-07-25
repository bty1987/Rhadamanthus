package com.fanglin.market.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.MarketSourceService;
import com.fanglin.market.vo.MarketSourceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MarketSourceAction extends BaseListAction {

	private static final long serialVersionUID = 1619964309041936184L;

	@Autowired
	private MarketSourceService marketSourceService;

	private MarketSourceVO marketSource;

	@Action(value = "pageMarketSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMarketSource() throws FLException {

		marketSourceService.pageMarketSource(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addMarketSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMarketSource() throws FLException {

		marketSourceService.addMarketSource(marketSource, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateMarketSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMarketSource() throws FLException {

		marketSourceService.updateMarketSource(marketSource, queryCompany());

		return SUCCESS;
	}

	@Action(value = "disableMarketSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableMarketSource() throws FLException {

		marketSourceService.disableMarketSource(marketSource, queryCompany());

		return SUCCESS;
	}

	public MarketSourceVO getMarketSource() {
		return marketSource;
	}

	public void setMarketSource(MarketSourceVO marketSource) {
		this.marketSource = marketSource;
	}

}

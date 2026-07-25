package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.MarketInboundService;
import com.fanglin.market.vo.MarketAttributionVO;
import com.fanglin.market.vo.MarketInboundVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MarketInboundAction extends BaseListAction {

	private static final long serialVersionUID = 3709106675230482101L;

	@Autowired
	private MarketInboundService marketInboundService;

	private MarketInboundVO marketInbound;

	private MarketAttributionVO marketAttribution;

	private List<MarketAttributionVO> marketAttributions;

	private int count;

	@Action(value = "pageMarketInbound", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMarketInbound() throws FLException {

		marketInboundService.pageMarketInbound(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryMarketInboundByMiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMarketInboundByMiid() throws FLException {

		marketInbound = marketInboundService.queryMarketInboundByMiid(marketInbound, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addMarketInbound", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMarketInbound() throws FLException {

		marketInboundService.addMarketInbound(marketInbound, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "retryMarketInbound", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String retryMarketInbound() throws FLException {

		marketInboundService.retryMarketInbound(marketInbound, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryMarketAttributionByCsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMarketAttributionByCsid() throws FLException {

		marketAttributions = marketInboundService.queryMarketAttributionByCsid(marketAttribution, queryCompany());

		return SUCCESS;
	}

	@Action(value = "countMarketInboundForCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countMarketInboundForCampaign() throws FLException {

		count = marketInboundService.countMarketInboundForCampaign(marketInbound, queryCompany());

		return SUCCESS;
	}

	@Action(value = "countMarketInboundForChannel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countMarketInboundForChannel() throws FLException {

		count = marketInboundService.countMarketInboundForChannel(marketInbound, queryCompany());

		return SUCCESS;
	}

	public MarketInboundVO getMarketInbound() {
		return marketInbound;
	}

	public void setMarketInbound(MarketInboundVO marketInbound) {
		this.marketInbound = marketInbound;
	}

	public MarketAttributionVO getMarketAttribution() {
		return marketAttribution;
	}

	public void setMarketAttribution(MarketAttributionVO marketAttribution) {
		this.marketAttribution = marketAttribution;
	}

	public List<MarketAttributionVO> getMarketAttributions() {
		return marketAttributions;
	}

	public void setMarketAttributions(List<MarketAttributionVO> marketAttributions) {
		this.marketAttributions = marketAttributions;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

}

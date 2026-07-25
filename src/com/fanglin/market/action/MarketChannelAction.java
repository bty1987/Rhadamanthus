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
import com.fanglin.market.service.MarketChannelService;
import com.fanglin.market.vo.MarketChannelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MarketChannelAction extends BaseListAction {

	private static final long serialVersionUID = -2269023061499183260L;

	@Autowired
	private MarketChannelService marketChannelService;

	private MarketChannelVO marketChannel;

	private List<MarketChannelVO> marketChannels;

	@Action(value = "pageMarketChannel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMarketChannel() throws FLException {

		marketChannelService.pageMarketChannel(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryMarketChannelForEnable", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMarketChannelForEnable() throws FLException {

		marketChannels = marketChannelService.queryMarketChannelForEnable(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addMarketChannel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMarketChannel() throws FLException {

		marketChannelService.addMarketChannel(marketChannel, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateMarketChannel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMarketChannel() throws FLException {

		marketChannelService.updateMarketChannel(marketChannel, queryCompany());

		return SUCCESS;
	}

	@Action(value = "disableMarketChannel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableMarketChannel() throws FLException {

		marketChannelService.disableMarketChannel(marketChannel, queryCompany());

		return SUCCESS;
	}

	public MarketChannelVO getMarketChannel() {
		return marketChannel;
	}

	public void setMarketChannel(MarketChannelVO marketChannel) {
		this.marketChannel = marketChannel;
	}

	public List<MarketChannelVO> getMarketChannels() {
		return marketChannels;
	}

	public void setMarketChannels(List<MarketChannelVO> marketChannels) {
		this.marketChannels = marketChannels;
	}

}

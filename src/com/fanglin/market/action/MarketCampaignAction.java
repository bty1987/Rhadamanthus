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
import com.fanglin.market.service.MarketCampaignService;
import com.fanglin.market.vo.MarketCampaignVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MarketCampaignAction extends BaseListAction {

	private static final long serialVersionUID = 4911933490964013584L;

	@Autowired
	private MarketCampaignService marketCampaignService;

	private MarketCampaignVO marketCampaign;

	private List<MarketCampaignVO> marketCampaigns;

	@Action(value = "pageMarketCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMarketCampaign() throws FLException {

		marketCampaignService.pageMarketCampaign(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryMarketCampaignForEnable", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMarketCampaignForEnable() throws FLException {

		marketCampaigns = marketCampaignService.queryMarketCampaignForEnable(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addMarketCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMarketCampaign() throws FLException {

		marketCampaignService.addMarketCampaign(marketCampaign, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateMarketCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMarketCampaign() throws FLException {

		marketCampaignService.updateMarketCampaign(marketCampaign, queryCompany());

		return SUCCESS;
	}

	@Action(value = "publishMarketCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String publishMarketCampaign() throws FLException {

		marketCampaignService.publishMarketCampaign(marketCampaign, queryCompany());

		return SUCCESS;
	}

	@Action(value = "disableMarketCampaign", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String disableMarketCampaign() throws FLException {

		marketCampaignService.disableMarketCampaign(marketCampaign, queryCompany());

		return SUCCESS;
	}

	public MarketCampaignVO getMarketCampaign() {
		return marketCampaign;
	}

	public void setMarketCampaign(MarketCampaignVO marketCampaign) {
		this.marketCampaign = marketCampaign;
	}

	public List<MarketCampaignVO> getMarketCampaigns() {
		return marketCampaigns;
	}

	public void setMarketCampaigns(List<MarketCampaignVO> marketCampaigns) {
		this.marketCampaigns = marketCampaigns;
	}

}

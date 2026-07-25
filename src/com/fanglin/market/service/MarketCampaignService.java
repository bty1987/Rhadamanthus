package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.MarketCampaignVO;
import com.fanglin.utils.Paging;

public interface MarketCampaignService {

	public void pageMarketCampaign(Paging paging, List<Filter> filters, int company);

	public List<MarketCampaignVO> queryMarketCampaignForEnable(int company);

	public void addMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException;

	public void updateMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException;

	public void publishMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException;

	public void disableMarketCampaign(MarketCampaignVO marketCampaignVO, int company) throws FLException;

}

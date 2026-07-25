package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.MarketCampaignPO;
import com.fanglin.utils.Paging;

public interface MarketCampaignDao extends Dao<MarketCampaignPO> {

	public List<MarketCampaignPO> pageMarketCampaign(Paging paging, List<Filter> filters, int company);

	public List<MarketCampaignPO> queryMarketCampaignForEnable(int company);

}

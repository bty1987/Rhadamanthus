package com.fanglin.market.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.po.MarketInboundPO;
import com.fanglin.utils.Paging;

public interface MarketInboundDao extends Dao<MarketInboundPO> {

	public List<MarketInboundPO> pageMarketInbound(Paging paging, List<Filter> filters, int company);

	public MarketInboundPO queryMarketInboundByNo(String inboundNo, int company);

	public MarketInboundPO queryMarketInboundByIdempotentKey(String idempotentKey, int company);

	public int countMarketInboundForCampaign(long campaignId, short status, int company);

	public int countMarketInboundForChannel(long channelId, short status, int company);

}

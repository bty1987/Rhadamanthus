package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.MarketAttributionVO;
import com.fanglin.market.vo.MarketInboundVO;
import com.fanglin.utils.Paging;

public interface MarketInboundService {

	public void pageMarketInbound(Paging paging, List<Filter> filters, int company);

	public MarketInboundVO queryMarketInboundByMiid(MarketInboundVO marketInboundVO, int company) throws FLException;

	public void addMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException;

	public void retryMarketInbound(MarketInboundVO marketInboundVO, String userId, int company) throws FLException;

	public List<MarketAttributionVO> queryMarketAttributionByCsid(MarketAttributionVO marketAttributionVO, int company) throws FLException;

	public int countMarketInboundForCampaign(MarketInboundVO marketInboundVO, int company) throws FLException;

	public int countMarketInboundForChannel(MarketInboundVO marketInboundVO, int company) throws FLException;

}

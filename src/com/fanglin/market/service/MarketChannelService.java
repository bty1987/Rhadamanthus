package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.MarketChannelVO;
import com.fanglin.utils.Paging;

public interface MarketChannelService {

	public void pageMarketChannel(Paging paging, List<Filter> filters, int company);

	public List<MarketChannelVO> queryMarketChannelForEnable(int company);

	public void addMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException;

	public void updateMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException;

	public void disableMarketChannel(MarketChannelVO marketChannelVO, int company) throws FLException;

}

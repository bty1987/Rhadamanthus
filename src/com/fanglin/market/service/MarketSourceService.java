package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.MarketSourceVO;
import com.fanglin.utils.Paging;

public interface MarketSourceService {

	public void pageMarketSource(Paging paging, List<Filter> filters, int company);

	public void addMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException;

	public void updateMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException;

	public void disableMarketSource(MarketSourceVO marketSourceVO, int company) throws FLException;

}

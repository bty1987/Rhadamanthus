package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.PriceVO;
import com.fanglin.utils.Paging;

public interface PriceService {

	public void pagePrice(Paging paging, List<Filter> filters, int company);

	public List<PriceVO> queryPriceByGid(PriceVO priceVO);

	public PriceVO queryPriceByPid(PriceVO priceVO);

	public int addPrice(PriceVO priceVO) throws FLException;

	public int deletePrice(PriceVO priceVO) throws FLException;

	public int updatePriceForStatus(PriceVO priceVO) throws FLException;

}

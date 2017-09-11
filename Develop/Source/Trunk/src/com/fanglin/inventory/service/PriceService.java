package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.PriceVO;

public interface PriceService {
	
	public List<PriceVO> queryPriceByGid(PriceVO priceVO);
	
	public PriceVO queryPriceByPid(PriceVO priceVO);
	
	public int addPrice(PriceVO priceVO) throws FLException;
	
	public int deletePrice(PriceVO priceVO) throws FLException;
	
}

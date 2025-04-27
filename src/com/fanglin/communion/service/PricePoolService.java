package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.PricePoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface PricePoolService {

	public void pagePricePool(Paging paging, List<Filter> filters);

	public List<PricePoolVO> queryPricePoolByGpid(PricePoolVO pricePoolVO);

	public PricePoolVO queryPricePoolByPpid(PricePoolVO pricePoolVO);

	public int addPricePool(PricePoolVO pricePoolVO) throws FLException;

	public int updatePricePoolForStatus(PricePoolVO pricePoolVO) throws FLException;

	public int deletePricePool(PricePoolVO pricePoolVO) throws FLException;

}

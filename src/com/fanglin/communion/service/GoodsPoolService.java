package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.GoodsPoolVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface GoodsPoolService {

	public void pageGoodsPool(Paging paging, List<Filter> filters) throws FLException;

	public List<GoodsPoolVO> queryGoodsPool(List<Filter> filters) throws FLException;

	public List<GoodsPoolVO> queryGoodsPoolByNo(GoodsPoolVO goodsPoolVO);

	public List<GoodsPoolVO> queryGoodsPoolByName(GoodsPoolVO goodsPoolVO);

	public List<GoodsPoolVO> queryGoodsPoolByAtid(GoodsPoolVO goodsPoolVO);

	public GoodsPoolVO queryGoodsPoolByBarcode(GoodsPoolVO goodsPoolVO);

	public GoodsPoolVO queryGoodsPoolByGpid(GoodsPoolVO goodsPoolVO);

	public int addGoodsPool(GoodsPoolVO goodsPoolVO) throws FLException;

	public int updateGoodsPool(GoodsPoolVO goodsPoolVO) throws FLException;

	public int updateGoodsPoolForStatus(GoodsPoolVO goodsPoolVO) throws FLException;

}

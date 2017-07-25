/**
 * @File Name		: GoodsService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.GoodsVO;
import com.fanglin.utils.Paging;

public interface GoodsService {
	
	public void pageGoods(Paging paging, List<Filter> filters,int company) throws FLException;
	
	public List<GoodsVO> queryGoods(List<Filter> filters,int company) throws FLException;
	
	public List<GoodsVO> queryGoodsByNo(GoodsVO goodsVO,int company);
	
	public List<GoodsVO> queryGoodsByName(GoodsVO goodsVO,int company);
	
	public List<GoodsVO> queryGoodsByAtid(GoodsVO goodsVO,int company);
	
	public GoodsVO queryGoodsByBarcode(GoodsVO goodsVO,int company);
	
	public GoodsVO queryGoodsByGId(GoodsVO goodsVO);
	
	public int addGoods(GoodsVO goodsVO,int company) throws FLException;
	
	public int updateGoods(GoodsVO goodsVO) throws FLException;
	
	public int updateGoodsForStatus(GoodsVO goodsVO) throws FLException;

}

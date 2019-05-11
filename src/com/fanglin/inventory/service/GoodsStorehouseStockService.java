/**
 * @File Name		: GoodsStorehouseStockService.java
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
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.inventory.vo.CheckListVO;
import com.fanglin.inventory.vo.GoodsStorehouseStockVO;
import com.fanglin.utils.Paging;

public interface GoodsStorehouseStockService {

	public void pageGoodsStorehouseStock(Paging paging, List<Filter> filters, String userId);

	public Float queryGoodsStorehouseStockByGid(GoodsStorehouseStockVO goodsStorehouseStockVO);

	public GoodsStorehouseStockVO queryStorehouseStockByShidAGid(GoodsStorehouseStockVO goodsStorehouseStock);

	public int makeGoodsStorehouseStock(GoodsStorehouseStockVO goodsStorehouseStockVO) throws FLException;

	public void checkGoodsStorehouseStock(CheckListVO checkListVO, String userId, int company) throws FLException;

	public int mergePackage(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId, int company) throws FLException;

	public int splitPackage(GoodsStorehouseStockVO goodsStorehouseStockVO, String userId, int company) throws FLException;

	public StorehousePO instorehouse(long gid, long cid, long fid, long shid, float num) throws FLException;

	public StorehousePO outstorehouse(long gid, long cid, long fid, long shid, float num) throws FLException;

}

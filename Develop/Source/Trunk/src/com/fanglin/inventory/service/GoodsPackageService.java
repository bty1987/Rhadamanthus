package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.GoodsPackageVO;

public interface GoodsPackageService {

	public List<GoodsPackageVO> queryPackage(GoodsPackageVO goodsPackageVO);
	
	public int bindGoodsForPackage(GoodsPackageVO goodsPackageVO) throws FLException;
	
	public int deleteGoodsForPackage(GoodsPackageVO goodsPackageVO) throws FLException;
}

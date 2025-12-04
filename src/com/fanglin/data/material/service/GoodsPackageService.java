package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.vo.GoodsPackageVO;
import com.fanglin.data.material.vo.GoodsVO;

public interface GoodsPackageService {

	public List<GoodsPackageVO> queryGoodsPackage(GoodsPackageVO goodsPackageVO);

	public int addGoodsPackage(GoodsVO goodsVO, List<GoodsPackageVO> goodsPackageVOs, int company) throws FLException;

	public void deleteGoodsPackage(GoodsPackageVO goodsPackageVO) throws FLException;

}

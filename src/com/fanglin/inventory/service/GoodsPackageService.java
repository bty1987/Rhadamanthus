package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.inventory.vo.GoodsPackageVO;

public interface GoodsPackageService {

	public List<GoodsPackageVO> queryPackage(GoodsPackageVO goodsPackageVO);
	
	
}

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.data.common.vo.BrandBalanceVO;

public interface BrandBalanceService {

	public List<BrandBalanceVO> queryBrandBalance(BrandBalanceVO brandBalanceVO);
	
	public void addBrandBalance(BrandBalanceVO brandBalanceVO);
	
	public void deleteBrandBalance(BrandBalanceVO brandBalanceVO);
	
}

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.BrandProductVO;

public interface BrandProductService {

	public List<BrandProductVO> queryBrandProduct(BrandProductVO brandProduct) throws FLException;

	public void addBrandProduct(BrandProductVO brandProduct) throws FLException;

	public void updateBrandProduct(BrandProductVO brandProduct) throws FLException;

	public void deleteBrandProduct(BrandProductVO brandProduct) throws FLException;

}

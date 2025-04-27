package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.BrandDeliverVO;

public interface BrandDeliverService {

	public List<BrandDeliverVO> queryBrandDeliver(BrandDeliverVO brandDeliver) throws FLException;

	public void addBrandDeliver(BrandDeliverVO brandDeliver) throws FLException;

	public void updateBrandDeliver(BrandDeliverVO brandDeliver) throws FLException;

	public void deleteBrandDeliver(BrandDeliverVO brandDeliver) throws FLException;
}

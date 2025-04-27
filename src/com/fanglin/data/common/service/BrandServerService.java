package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.BrandServerVO;

public interface BrandServerService {

	public List<BrandServerVO> queryBrandServer(BrandServerVO brandServer) throws FLException;

	public void addBrandServer(BrandServerVO brandServer) throws FLException;

	public void updateBrandServer(BrandServerVO brandServer) throws FLException;

	public void deleteBrandServer(BrandServerVO brandServer) throws FLException;

}

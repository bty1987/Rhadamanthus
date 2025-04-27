package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.BrandInstallVO;

public interface BrandInstallService {

	public List<BrandInstallVO> queryBrandInstall(BrandInstallVO brandInstall) throws FLException;

	public void addBrandInstall(BrandInstallVO brandInstall) throws FLException;

	public void updateBrandInstall(BrandInstallVO brandInstall) throws FLException;

	public void deleteBrandInstall(BrandInstallVO brandInstall) throws FLException;

}

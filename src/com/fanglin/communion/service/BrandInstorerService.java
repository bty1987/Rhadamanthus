package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.BrandInstorerVO;

public interface BrandInstorerService {

	public List<BrandInstorerVO> queryBrandInstorer(BrandInstorerVO brandInstorer);

	public void addBrandInstorer(BrandInstorerVO brandInstorer);

	public void deleteBrandInstorer(BrandInstorerVO brandInstorer);

}

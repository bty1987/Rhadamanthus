package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.BrandSupplierVO;

public interface BrandSupplierService {

	public List<BrandSupplierVO> queryBrandSupplier(BrandSupplierVO brandSupplier);

	public void addBrandSupplier(BrandSupplierVO brandSupplier);

	public void deleteBrandSupplier(BrandSupplierVO brandSupplier);

}

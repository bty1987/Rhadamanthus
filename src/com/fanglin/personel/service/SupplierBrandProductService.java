package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.SupplierBrandProductVO;

public interface SupplierBrandProductService {

	public List<SupplierBrandProductVO> querySupplierBrandProduct(SupplierBrandProductVO supplierBrand) throws FLException;
	
	public void addSupplierBrandProduct(SupplierBrandProductVO supplierBrand) throws FLException;

	public int deleteSupplierBrandProduct(SupplierBrandProductVO supplierBrand) throws FLException;
	
}

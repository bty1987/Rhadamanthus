package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.SupplierContractCategoryVO;

public interface SupplierContractCategoryService {

	public List<SupplierContractCategoryVO> querySupplierContractCategory(SupplierContractCategoryVO supplierBrand) throws FLException;
	
	public void addSupplierContractCategory(SupplierContractCategoryVO supplierBrand) throws FLException;

	public int deleteSupplierContractCategory(SupplierContractCategoryVO supplierBrand) throws FLException;
	
}

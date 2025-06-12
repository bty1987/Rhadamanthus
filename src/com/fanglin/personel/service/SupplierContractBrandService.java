package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.SupplierContractBrandVO;
import com.fanglin.utils.Paging;

public interface SupplierContractBrandService {

	public void pageSupplierContractBrand(Paging paging, List<Filter> filters, int company, SupplierContractBrandVO supplierContractBrand) throws FLException;

	public List<SupplierContractBrandVO> querySupplierContractBrand(SupplierContractBrandVO supplierBrand) throws FLException;

	public void addSupplierContractBrand(SupplierContractBrandVO supplierBrand, int company) throws FLException;

	public int deleteSupplierContractBrand(SupplierContractBrandVO supplierBrand) throws FLException;
	
	public void updateSupplierContractBrand(SupplierContractBrandVO supplierBrand) throws FLException;

}

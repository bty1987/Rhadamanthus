package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.SupplierContractProductVO;

public interface SupplierContractProductService {

	public List<SupplierContractProductVO> querySupplierContractProduct(SupplierContractProductVO supplierContractProduct) throws FLException;

	public void addSupplierContractProduct(List<SupplierContractProductVO> supplierContractProductVOs) throws FLException;

	public int deleteSupplierContractProduct(SupplierContractProductVO supplierContractProduct) throws FLException;

}

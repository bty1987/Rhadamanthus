package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.SupplierContractServiceVO;

public interface SupplierContractServiceService {

	public List<SupplierContractServiceVO> querySupplierContractServiceBySid(SupplierContractServiceVO supplierContractServiceVO);

	public void addSupplierContractService(SupplierContractServiceVO supplierContractServiceVO) throws FLException;

	public int deleteSupplierContractService(SupplierContractServiceVO supplierContractServiceVO) throws FLException;


}

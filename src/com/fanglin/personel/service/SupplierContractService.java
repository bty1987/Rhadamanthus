package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.personel.vo.SupplierContractVO;

public interface SupplierContractService {

	public List<SupplierContractVO> querySupplierContract(SupplierContractVO supplierContractVO);

	public int addSupplierContract(SupplierContractVO supplierContractVO, ContractVO contractVO, String data, String userId) throws FLException;

	public int updateSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public int deleteSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public String viewSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public int affixSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public int expireSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public int filingSupplierContract(SupplierContractVO supplierContractVO) throws FLException;

	public String signSupplierContractForUser(SupplierContractVO supplierContractVO) throws FLException;

	public String signSupplierContractForCompany(SignetVO signetVO, SupplierContractVO supplierContractVO) throws FLException;

}

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.SupplierVO;

public interface SupplierService {

	public List<SupplierVO> querySupplierByGid(SupplierVO supplierVO);
	
	public List<SupplierVO> querySupplierForEnableByGid(SupplierVO supplierVO);
	
	public int addSupplier(SupplierVO supplierVO) throws FLException;
	
	public int updateSupplierForStatus(SupplierVO supplierVO) throws FLException;
	
}

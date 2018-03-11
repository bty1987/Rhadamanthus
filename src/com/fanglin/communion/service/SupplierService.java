/**
 * @File Name		: SupplierService.java
 * @Package   	: com.fanglin.data.service
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.SupplierVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface SupplierService {
	
	public void pageSupplier(Paging paging, List<Filter> filters);
	
	public SupplierVO querySupplierBySId(SupplierVO supplierVO) throws FLException;
	
	public SupplierVO querySupplierByLoginId(SupplierVO supplierVO) throws FLException;
	
	public int addSupplier(SupplierVO supplierVO) throws FLException;
	
	public int updateSupplier(SupplierVO supplierVO) throws FLException;
	
	public int updateSupplierForLogin(SupplierVO supplierVO) throws FLException;
	
	public int updateSupplierForPassword(SupplierVO supplierVO, String password) throws FLException;
	
}

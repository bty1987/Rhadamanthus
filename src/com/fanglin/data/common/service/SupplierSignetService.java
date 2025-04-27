package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.SupplierSignetVO;
import com.fanglin.utils.Paging;

public interface SupplierSignetService {

	public void pageSupplierSignet(Paging paging, List<Filter> filters, SupplierSignetVO signet, int company);

	public List<SupplierSignetVO> querySupplierSignet(SupplierSignetVO supplierSignetVO, int company);

	public SupplierSignetVO querySupplierSignet(SupplierSignetVO supplierSignetVO);

	public int addSupplierSignet(SupplierSignetVO signet, int company) throws FLException;

	public int updateSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int registSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public String authSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int confirmSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int signateSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public String autoSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int selectSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int cancelSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int copySupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

	public int moveSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException;

}

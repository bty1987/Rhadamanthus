package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.SupplierContractGoodsVO;
import com.fanglin.utils.Paging;

public interface SupplierContractGoodsService {

	public void pageSupplierContractGoods(Paging paging, List<Filter> filters, int company, SupplierContractGoodsVO supplierContractGoods) throws FLException;

	public List<SupplierContractGoodsVO> querySupplierContractGoods(SupplierContractGoodsVO supplierContractGoods) throws FLException;

	public void addSupplierContractGoods(SupplierContractGoodsVO supplierContractGoods, int company) throws FLException;

	public int deleteSupplierContractGoods(SupplierContractGoodsVO supplierContractGoods) throws FLException;

}

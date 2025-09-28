package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.personel.dao.SupplierContractGoodsDao;
import com.fanglin.personel.po.SupplierContractGoodsPO;
import com.fanglin.personel.service.SupplierContractGoodsService;
import com.fanglin.personel.vo.SupplierContractGoodsVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("supplierContractGoodsService")
@Transactional(readOnly = true)
public class SupplierContractGoodsServiceImpl implements SupplierContractGoodsService {

	@Autowired
	private SupplierContractGoodsDao supplierContractGoodsDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageSupplierContractGoods(Paging paging, List<Filter> filters, int company, SupplierContractGoodsVO supplierContractGoods) throws FLException {

		List<SupplierContractGoodsPO> supplierContractGoodsPOs = supplierContractGoodsDao.pageSupplierContractGoods(paging, filters, company, supplierContractGoods.getScid());
		List<SupplierContractGoodsVO> supplierContractGoodsVOs = new ArrayList<SupplierContractGoodsVO>();

		for (SupplierContractGoodsPO supplierContractGoodsPO : supplierContractGoodsPOs) {

			supplierContractGoodsVOs.add(supplierContractGoodsPO.ptv(new SupplierContractGoodsVO(new GoodsPO())));
		}

		paging.setData(supplierContractGoodsVOs);
	}

	@Override
	public List<SupplierContractGoodsVO> querySupplierContractGoods(SupplierContractGoodsVO supplierContractGoods) throws FLException {

		List<SupplierContractGoodsPO> supplierContractGoodsPOs = supplierContractGoodsDao.querySupplierContractGoods(supplierContractGoods.getScid());
		List<SupplierContractGoodsVO> supplierContractGoodsVOs = new ArrayList<SupplierContractGoodsVO>();

		for (SupplierContractGoodsPO supplierContractGoodsPO : supplierContractGoodsPOs) {
			supplierContractGoodsVOs.add(supplierContractGoodsPO.ptv(new SupplierContractGoodsVO(new GoodsPO())));
		}

		return supplierContractGoodsVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierContractGoods(SupplierContractGoodsVO supplierContractGoods, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		GoodsPO goodsPO = goodsDao.get(supplierContractGoods.getGoods().getGid());

		if (goodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		SupplierContractGoodsPO supplierContractGoodsPO = new SupplierContractGoodsPO();

		BeanUtil.copyProperties(supplierContractGoods, supplierContractGoodsPO, Arrays.asList("goods"));

		supplierContractGoodsPO.setGoods(goodsPO);

		supplierContractGoodsDao.save(supplierContractGoodsPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContractGoods(SupplierContractGoodsVO supplierContractGoods) throws FLException {

		SupplierContractGoodsPO supplierContractGoodsPO = supplierContractGoodsDao.get(supplierContractGoods.getScgid());

		if (supplierContractGoodsPO == null) {
			throw new FLException(260004, "商品不存在");
		}

		supplierContractGoodsDao.delete(supplierContractGoodsPO);

		return 0;
	}

}

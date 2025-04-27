/**
 * @File Name		: SupplierServiceImpl.java
 * @Package   	: com.fanglin.personel.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.SupplierContractBrandDao;
import com.fanglin.personel.po.SupplierContractBrandPO;
import com.fanglin.personel.service.SupplierContractBrandService;
import com.fanglin.personel.vo.SupplierContractBrandVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("supplierBrandService")
@Transactional(readOnly = true)
public class SupplierContractBrandServiceImpl implements SupplierContractBrandService {

	@Autowired
	private SupplierContractBrandDao supplierBrandDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private BrandDao brandDao;

	@Override
	public void pageSupplierContractBrand(Paging paging, List<Filter> filters, int company, SupplierContractBrandVO supplierContractBrand) throws FLException {

		List<SupplierContractBrandPO> supplierBrandPOs = supplierBrandDao.pageSupplierBrand(paging, filters, company, supplierContractBrand.getScid());
		List<SupplierContractBrandVO> supplierBrandVOs = new ArrayList<SupplierContractBrandVO>();

		for (SupplierContractBrandPO supplierBrandPO : supplierBrandPOs) {
			supplierBrandVOs.add(supplierBrandPO.ptv(new SupplierContractBrandVO(new BrandPO())));
		}

		paging.setData(supplierBrandVOs);
	}

	@Override
	public List<SupplierContractBrandVO> querySupplierContractBrand(SupplierContractBrandVO supplierBrand) throws FLException {

		List<SupplierContractBrandPO> supplierBrandPOs = supplierBrandDao.querySupplierBrand(supplierBrand.getScbid());
		List<SupplierContractBrandVO> supplierBrandVOs = new ArrayList<SupplierContractBrandVO>();

		for (SupplierContractBrandPO supplierBrandPO : supplierBrandPOs) {

			SupplierContractBrandVO supplierBrandVO = new SupplierContractBrandVO();

			supplierBrandPO.ptv(supplierBrandVO);

			supplierBrandVOs.add(supplierBrandVO);
		}

		return supplierBrandVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierContractBrand(SupplierContractBrandVO supplierBrand, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		SupplierContractBrandPO supplierBrandPO = new SupplierContractBrandPO();

		BeanUtil.copyProperties(supplierBrand, supplierBrandPO, Arrays.asList("brand"));

		if (supplierBrand.getBrand() != null) {

			BrandPO brand = brandDao.get(supplierBrand.getBrand().getBid());

			if (brand == null) {
				throw new FLException(130077, "品牌不存在");
			}

			supplierBrandPO.setBrand(brand);
		}

		supplierBrandDao.save(supplierBrandPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContractBrand(SupplierContractBrandVO supplierBrand) throws FLException {

		SupplierContractBrandPO supplierBrandPO = supplierBrandDao.get(supplierBrand.getScbid());

		if (supplierBrandPO == null) {
			throw new FLException(130077, "厂商品牌不存在");
		}

		supplierBrandDao.delete(supplierBrandPO);

		return 0;
	}

}

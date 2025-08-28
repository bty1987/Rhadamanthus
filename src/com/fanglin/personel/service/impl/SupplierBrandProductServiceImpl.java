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
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.SupplierBrandProductDao;
import com.fanglin.personel.po.SupplierBrandProductPO;
import com.fanglin.personel.service.SupplierBrandProductService;
import com.fanglin.personel.vo.SupplierBrandProductVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierBrandProductService")
@Transactional(readOnly = true)
public class SupplierBrandProductServiceImpl implements SupplierBrandProductService {

	@Autowired
	private SupplierBrandProductDao supplierBrandProductDao;

	@Override
	public List<SupplierBrandProductVO> querySupplierBrandProduct(SupplierBrandProductVO supplierBrandProduct) throws FLException {

		List<SupplierBrandProductPO> supplierBrandProductPOs = supplierBrandProductDao.querySupplierBrandProduct(supplierBrandProduct.getScbid());
		List<SupplierBrandProductVO> supplierBrandProductVOs = new ArrayList<SupplierBrandProductVO>();

		for (SupplierBrandProductPO supplierBrandProductPO : supplierBrandProductPOs) {

			SupplierBrandProductVO supplierBrandProductVO = new SupplierBrandProductVO();

			BeanUtil.copyPropertie(supplierBrandProductPO, supplierBrandProductVO);

			supplierBrandProductVOs.add(supplierBrandProductVO);
		}

		return supplierBrandProductVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierBrandProduct(SupplierBrandProductVO supplierBrandProduct) throws FLException {

		SupplierBrandProductPO supplierBrandProductPO = new SupplierBrandProductPO();

		BeanUtil.copyProperties(supplierBrandProduct, supplierBrandProductPO);

		supplierBrandProductDao.save(supplierBrandProductPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierBrandProduct(SupplierBrandProductVO supplierBrandProduct) throws FLException {

		SupplierBrandProductPO supplierBrandProductPO = supplierBrandProductDao.get(supplierBrandProduct.getSbpid());

		if (supplierBrandProductPO == null) {
			throw new FLException(130077, "厂商品牌产品不存在");
		}

		supplierBrandProductDao.delete(supplierBrandProductPO);

		return 0;
	}

}

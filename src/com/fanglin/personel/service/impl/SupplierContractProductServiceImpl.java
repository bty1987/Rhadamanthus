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
import com.fanglin.personel.dao.SupplierContractProductDao;
import com.fanglin.personel.po.SupplierContractProductPO;
import com.fanglin.personel.service.SupplierContractProductService;
import com.fanglin.personel.vo.SupplierContractProductVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierContractProductService")
@Transactional(readOnly = true)
public class SupplierContractProductServiceImpl implements SupplierContractProductService {

	@Autowired
	private SupplierContractProductDao supplierContractProductDao;

	@Override
	public List<SupplierContractProductVO> querySupplierContractProduct(SupplierContractProductVO supplierContractProduct) throws FLException {

		List<SupplierContractProductPO> supplierContractProductPOs = supplierContractProductDao.querySupplierContractProduct(supplierContractProduct.getScid());
		List<SupplierContractProductVO> supplierContractProductVOs = new ArrayList<SupplierContractProductVO>();

		for (SupplierContractProductPO supplierContractProductPO : supplierContractProductPOs) {
			supplierContractProductVOs.add(supplierContractProductPO.ptv(new SupplierContractProductVO()));
		}

		return supplierContractProductVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierContractProduct(List<SupplierContractProductVO> supplierContractProductVOs) throws FLException {

		for (SupplierContractProductVO supplierContractProductVO : supplierContractProductVOs) {

			SupplierContractProductPO supplierContractProductPO = new SupplierContractProductPO();

			BeanUtil.copyPropertie(supplierContractProductVO, supplierContractProductPO);

			supplierContractProductDao.save(supplierContractProductPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContractProduct(SupplierContractProductVO supplierContractProduct) throws FLException {

		SupplierContractProductPO supplierContractProductPO = supplierContractProductDao.get(supplierContractProduct.getScpid());

		if (supplierContractProductPO == null) {
			throw new FLException(130171, "产品不存在");
		}

		supplierContractProductDao.delete(supplierContractProductPO);

		return 0;
	}

}

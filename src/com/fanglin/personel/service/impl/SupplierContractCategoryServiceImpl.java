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
import com.fanglin.personel.dao.SupplierContractCategoryDao;
import com.fanglin.personel.po.SupplierContractCategoryPO;
import com.fanglin.personel.service.SupplierContractCategoryService;
import com.fanglin.personel.vo.SupplierContractCategoryVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierContractCategoryService")
@Transactional(readOnly = true)
public class SupplierContractCategoryServiceImpl implements SupplierContractCategoryService {

	@Autowired
	private SupplierContractCategoryDao supplierContractCategoryDao;

	@Override
	public List<SupplierContractCategoryVO> querySupplierContractCategory(SupplierContractCategoryVO supplierContractCategory) throws FLException {

		List<SupplierContractCategoryPO> supplierContractCategoryPOs = supplierContractCategoryDao.querySupplierContractCategory(supplierContractCategory.getScbid());
		List<SupplierContractCategoryVO> supplierContractCategoryVOs = new ArrayList<SupplierContractCategoryVO>();

		for (SupplierContractCategoryPO supplierContractCategoryPO : supplierContractCategoryPOs) {
			supplierContractCategoryVOs.add(supplierContractCategoryPO.ptv(new SupplierContractCategoryVO()));
		}

		return supplierContractCategoryVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierContractCategory(SupplierContractCategoryVO supplierContractCategory) throws FLException {

		SupplierContractCategoryPO supplierContractCategoryPO = new SupplierContractCategoryPO();

		BeanUtil.copyProperties(supplierContractCategory, supplierContractCategoryPO);

		supplierContractCategoryDao.save(supplierContractCategoryPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContractCategory(SupplierContractCategoryVO supplierContractCategory) throws FLException {

		SupplierContractCategoryPO supplierContractCategoryPO = supplierContractCategoryDao.get(supplierContractCategory.getSccid());

		if (supplierContractCategoryPO == null) {
			throw new FLException(130155, "产品不存在");
		}

		supplierContractCategoryDao.delete(supplierContractCategoryPO);

		return 0;
	}

}

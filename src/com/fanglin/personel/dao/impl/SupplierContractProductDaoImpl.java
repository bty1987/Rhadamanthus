/**
 * @File Name		: SupplierDaoImpl.java
 * @Package   	: com.fanglin.personel.dao.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.SupplierContractProductDao;
import com.fanglin.personel.po.SupplierContractProductPO;

@Repository("supplierContractProductDao")
public class SupplierContractProductDaoImpl extends DaoImpl<SupplierContractProductPO> implements SupplierContractProductDao {

	public SupplierContractProductDaoImpl() {
		super(SupplierContractProductPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractProductPO> querySupplierContractProduct(Long scid) {

		return session().createCriteria(SupplierContractProductPO.class).add(Restrictions.eq("scid", scid)).list();
	}

}

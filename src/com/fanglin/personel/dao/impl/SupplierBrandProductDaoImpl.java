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
import com.fanglin.personel.dao.SupplierBrandProductDao;
import com.fanglin.personel.po.SupplierBrandProductPO;

@Repository("supplierBrandProductDao")
public class SupplierBrandProductDaoImpl extends DaoImpl<SupplierBrandProductPO> implements SupplierBrandProductDao {

	public SupplierBrandProductDaoImpl() {
		super(SupplierBrandProductPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierBrandProductPO> querySupplierBrandProduct(Long scbid) {

		return session().createCriteria(SupplierBrandProductPO.class).add(Restrictions.eq("scbid", scbid)).list();
	}

}

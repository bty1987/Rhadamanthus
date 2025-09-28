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
import com.fanglin.personel.dao.SupplierContractCategoryDao;
import com.fanglin.personel.po.SupplierContractCategoryPO;

@Repository("supplierContractCategoryDao")
public class SupplierContractCategoryDaoImpl extends DaoImpl<SupplierContractCategoryPO> implements SupplierContractCategoryDao {

	public SupplierContractCategoryDaoImpl() {
		super(SupplierContractCategoryPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractCategoryPO> querySupplierContractCategory(Long scbid) {

		return session().createCriteria(SupplierContractCategoryPO.class).add(Restrictions.eq("scbid", scbid)).list();
	}

}

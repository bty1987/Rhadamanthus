package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.SupplierContractDao;
import com.fanglin.personel.po.SupplierContractPO;

@Repository("supplierContractDao")
public class SupplierContractDaoImpl extends DaoImpl<SupplierContractPO> implements SupplierContractDao {

	public SupplierContractDaoImpl() {
		super(SupplierContractPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractPO> querySupplierContract(Integer uid) {
		return session().createCriteria(SupplierContractPO.class).add(Restrictions.eq("uid", uid)).list();
	}

}

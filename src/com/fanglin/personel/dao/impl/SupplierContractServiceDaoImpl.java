package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.SupplierContractServiceDao;
import com.fanglin.personel.po.SupplierContractServicePO;

@Repository("supplierContractServiceDao")
public class SupplierContractServiceDaoImpl extends DaoImpl<SupplierContractServicePO> implements SupplierContractServiceDao {

	public SupplierContractServiceDaoImpl() {
		super(SupplierContractServicePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SupplierContractServicePO> querySupplierContractServiceBySid(Long sid) {
		return session().createCriteria(SupplierContractServicePO.class).add(Restrictions.eq("sid", sid)).list();
	}

}

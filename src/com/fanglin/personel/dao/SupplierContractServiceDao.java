package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.SupplierContractServicePO;

public interface SupplierContractServiceDao extends Dao<SupplierContractServicePO> {

	public List<SupplierContractServicePO> querySupplierContractServiceBySid(Long sid);

}

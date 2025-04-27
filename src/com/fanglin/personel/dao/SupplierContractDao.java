package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.SupplierContractPO;

public interface SupplierContractDao extends Dao<SupplierContractPO> {

	public List<SupplierContractPO> querySupplierContract(Integer uid);

}

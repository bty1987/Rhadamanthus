package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.SupplierPO;

public interface SupplierDao extends Dao<SupplierPO>{

	public List<SupplierPO> querySupplierByGid(long gid);
	
	public List<SupplierPO> querySupplierForEnableByGid(long gid);
	
	public SupplierPO querySupplierByName(long gid, String name);
	
}

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.GoodsPackagePO;

public interface GoodsPackageDao extends Dao<GoodsPackagePO>{

	public List<GoodsPackagePO> queryPackage(long pid);
	
}

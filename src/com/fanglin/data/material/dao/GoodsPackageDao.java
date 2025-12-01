package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.GoodsPackagePO;

public interface GoodsPackageDao extends Dao<GoodsPackagePO>{

	public List<GoodsPackagePO> queryPackage(long pid);
	
}

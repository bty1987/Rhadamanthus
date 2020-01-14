package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.AccessoriesManifestPO;

public interface AccessoriesManifestDao extends Dao<AccessoriesManifestPO>{
	
	public List<AccessoriesManifestPO> queryManifestByAid(long aid, Short type);

}

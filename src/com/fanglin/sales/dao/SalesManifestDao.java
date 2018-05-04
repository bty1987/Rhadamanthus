package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesManifestPO;

public interface SalesManifestDao extends Dao<SalesManifestPO> {
	
	public List<SalesManifestPO> querySalesManifestBySid(long sid);

}

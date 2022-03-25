package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.OccessoriesCostPO;

public interface OccessoriesCostDao extends Dao<OccessoriesCostPO> {

	public List<OccessoriesCostPO> queryOccessoriesCost(long oid);

}

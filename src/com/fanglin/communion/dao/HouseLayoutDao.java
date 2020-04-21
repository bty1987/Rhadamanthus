package com.fanglin.communion.dao;

import java.util.List;


import com.fanglin.communion.po.HouseLayoutPO;
import com.fanglin.core.dao.Dao;

public interface HouseLayoutDao extends Dao<HouseLayoutPO> {

	public List<HouseLayoutPO> queryHouseLayout(long vid);
	
}

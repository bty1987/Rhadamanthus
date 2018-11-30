package com.fanglin.market.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.market.po.CuserPO;

public interface CuserDao extends Dao<CuserPO> {
	
	public CuserPO queryCuserByUnionId(String unionId);
}
